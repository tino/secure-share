from apistar import App, Include, Route, http, exceptions

import secrets
import settings


def frontend():
    with open("frontend/dist/index.html") as f:
        return http.Response(f.read(), headers=dict(content_type="text/html"))


def settings_() -> dict:
    return {"base_url": settings.BASE_URL}


class CORSHook:

    def on_response(
        self, request: http.Request, response: http.Response, exc: Exception
    ):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = (
            "DNT,User-Agent,X-Requested-With,If-Modified-Since,"
            "Cache-Control,Content-Type,Range"
        )

        if isinstance(exc, exceptions.MethodNotAllowed) and request.method == "OPTIONS":
            response.headers["Content-Type"] = "text/html"
            response.status_code = 204
            response.content = b""
            return response

        return response


routes = [
    Route("/api/settings", method="GET", handler=settings_),
    Include("/api/secrets", name="secrets", routes=secrets.routes),
    Route("/", method="GET", handler=frontend, name="home"),
    Route("/{path}", method="GET", handler=frontend, name="catchall"),
]

app = App(routes=routes, static_dir=settings.STATIC_DIR, event_hooks=[CORSHook()])

# Dev server
if __name__ == "__main__":
    app.serve("127.0.0.1", 5000, debug=True)

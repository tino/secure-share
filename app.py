from apistar import App, Include, Route, http, exceptions

import secrets
import settings


def homepage(app: App):
    return app.render_template("home.html")


class CORSHook:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }

    def on_response(self, request: http.Request, response: http.Response, exc: Exception):
        if isinstance(exc, exceptions.MethodNotAllowed) and request.method == 'OPTIONS':
            return http.Response('', status_code=204, headers=self.headers)

        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

    def on_error(self, request: http.Request, response: http.Response, exc: Exception):
        if isinstance(exc, exceptions.MethodNotAllowed) and request.method == 'OPTIONS':
            return http.Response('', status_code=204, headers=self.headers)

        return response


routes = [
    Route("/", method="GET", handler=homepage),
    Include("/api/secrets", name="secrets", routes=secrets.routes),
]

app = App(routes=routes, template_dir=settings.TEMPLATE_DIR)  #, event_hooks=[CORSHook()])

# Dev server
if __name__ == "__main__":
    app.serve("127.0.0.1", 5000, debug=True)

import os
import secrets

import settings
from aiohttp import web
from vault import vault_master


async def frontend(request):
    return web.FileResponse(os.path.join(settings.STATIC_DIR, "index.html"))


async def settings_(request):
    return web.json_response({"base_url": settings.BASE_URL})


routes = [
    web.get("/api/settings", handler=settings_),
    web.get("/", handler=frontend, name="home"),
    web.static("/static", settings.STATIC_DIR),
]

app = web.Application()
app.add_routes(routes)
app.add_subapp("/api/secrets/", secrets.app)
# Need to do it this way to make subapp routes work before it?
app.router.add_route("GET", "/{path:.*}", frontend)
app.cleanup_ctx.append(vault_master)

# Dev server
if __name__ == "__main__":
    web.run_app(app, port=8000)

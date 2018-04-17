from apistar import App, Route, Include

import settings
import secrets


def homepage(app: App):
    return app.render_template('home.html')


routes = [
    Route('/', method='GET', handler=homepage),
    Include('/secrets', name='secrets', routes=secrets.routes)
]

app = App(routes=routes, template_dir=settings.TEMPLATE_DIR)

# Dev server
if __name__ == '__main__':
    app.serve('127.0.0.1', 5000, use_debugger=True, use_reloader=True)

import os

import hvac
from apistar import App, Route, exceptions, types, validators

import settings
from utils import slugify
from vault import master_client


class Secret(types.Type):
    name = validators.String(max_length=100)
    value = validators.String(max_length=100)


def new_cubbyhole(secret: Secret):
    """
    Create a new token with a lifetime of a week, and with it store the secret
    in a cubbyhole.
    """
    token = master_client.create_token(policies=['single-secure-share'], lease='168h')
    client = hvac.Client(settings.VAULT_URL, token=token['auth']['client_token'])
    path = os.path.join(settings.VAULT_SECRET_BASE, slugify(secret.name))
    client.write(path, name=secret.name, value=secret.value, lease=f'{7 * 24}h')
    return token


def new_secret_page(app: App):
    return app.render_template('new_secret.html')


def new_secret(app: App, secret: Secret):
    token = new_cubbyhole(secret)
    return {'token': token}
    # raise exceptions.Found(location=app.reverse_url('secrets:secret_added'))


def secret_added(app: App):
    return app.render_template('secret_added.html')


routes = [
    Route('/new', method='GET', handler=new_secret_page),
    Route('/new', method='POST', handler=new_secret),
    Route('/added', method='GET', handler=secret_added),
]

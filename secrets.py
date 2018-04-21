import datetime
import os

import hvac
from apistar import App, Route, exceptions, types, validators

import settings
from utils import slugify
from vault import master_client

CUBBYHOLE_PATH = path = os.path.join(settings.VAULT_SECRET_BASE, 'secret')


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
    client.write(CUBBYHOLE_PATH, name=secret.name, value=secret.value, lease=f'{7 * 24}h')
    return token


def new_secret_page(app: App):
    return app.render_template('new_secret.html')


def new_secret(app: App, secret: Secret):
    token = new_cubbyhole(secret)
    return {
        'url': app.reverse_url('secrets:show_secret', token=token['auth']['client_token']),
        'expiration': (
            datetime.datetime.now() +
            datetime.timedelta(seconds=token['auth']['lease_duration'])
        ).isoformat()
    }


def show_secret(token: str):
    client = hvac.Client(settings.VAULT_URL, token=token)
    try:
        return client.lookup_token()
    except hvac.exceptions.Forbidden:
        raise exceptions.NotFound


def show_secret_contents(token: str):
    client = hvac.Client(settings.VAULT_URL, token=token)
    try:
        return client.read(CUBBYHOLE_PATH)
    except hvac.exceptions.Forbidden:
        raise exceptions.NotFound


def secret_added(app: App):
    return app.render_template('secret_added.html')


routes = [
    Route('/new', method='GET', handler=new_secret_page),
    Route('/new', method='POST', handler=new_secret),
    Route('/added', method='GET', handler=secret_added),
    Route('/show/{token}', method='GET', handler=show_secret),
    Route('/show/{token}/content', method='GET', handler=show_secret_contents),
]

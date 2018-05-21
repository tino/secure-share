import datetime
import os

import hvac
from apistar import App, Route, exceptions, types, validators

import settings
from vault import master_client

CUBBYHOLE_PATH = os.path.join(settings.VAULT_SECRET_BASE, "secret")


class Secret(types.Type):
    name = validators.String(max_length=100)
    value = validators.String(max_length=100)


def new_cubbyhole(secret: Secret):
    """
    Create a new token with a lifetime of a week, and with it store the secret
    in a cubbyhole.
    """
    token = master_client.create_token(policies=["single-secure-share"], lease="168h")
    client = hvac.Client(settings.VAULT_URL, token=token["auth"]["client_token"])
    client.write(
        CUBBYHOLE_PATH, name=secret.name, value=secret.value, lease=f"{7 * 24}h"
    )
    return token


def new_secret(app: App, secret: Secret):
    token = new_cubbyhole(secret)
    return {
        "url": app.reverse_url(
            "secrets:show_secret", token=token["auth"]["client_token"]
        ),
        "token": token["auth"]["client_token"],
        "expiration": (
            datetime.datetime.now()
            + datetime.timedelta(seconds=token["auth"]["lease_duration"])
        ).isoformat(),
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


routes = [
    Route("/new", method="POST", handler=new_secret),
    Route("/show/{token}", method="GET", handler=show_secret),
    Route("/show/{token}/contents", method="GET", handler=show_secret_contents),
]

import os

from envparse import env

VAULT_ADDR = env("VAULT_ADDR", default="http://127.0.0.1:8200")
VAULT_TOKEN = env("VAULT_TOKEN")
VAULT_SECRET_BASE = env("VAULT_SECRET_BASE", default="cubbyhole/secure-share")

BASE_DIR = os.path.dirname(__file__)
STATIC_DIR = env("STATIC_DIR", default=os.path.join(BASE_DIR, "frontend/dist"))

BASE_URL = "http://localhost:5000"

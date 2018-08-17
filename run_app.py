import bjoern
from app import app

try:
    bjoern.run(app, '0.0.0.0', 8000)
except KeyboardInterrupt:
    exit(0)

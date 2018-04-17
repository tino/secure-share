import hvac

import settings

master_client = hvac.Client(settings.VAULT_URL, token=settings.VAULT_TOKEN)

import hvac
import settings

master_client = hvac.Client(settings.VAULT_ADDR, token=settings.VAULT_TOKEN)

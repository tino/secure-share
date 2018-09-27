import async_hvac
import settings


async def vault_master(app):
    app["vault_master"] = async_hvac.AsyncClient(
        settings.VAULT_ADDR, token=settings.VAULT_TOKEN
    )
    yield
    await app["vault_master"].close()

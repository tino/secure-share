# Secure Share

## Getting started

Run vault and create a token. In development use the dev server as such:

```
vault server -dev
```

The root token is in the output. You can set that to the `VAULT_TOKEN` env var,
or use it to generate a new, non-root token (after setting the correct
`VAULT_ADDR` as per the output.:

`vault token create`

Run the backend: `python app.py`

Run the frontend: `yarn dev`

See it at http://localhost:1234!

## TODO

- [x] Welcome text
- [ ] Custom fields
- [x] Error on backend 404 instead of loading...
- [ ] Single-view secrets
- [ ] Better error display (and removal)
- [x] Remove backend views
- [ ] Custom lifetimes

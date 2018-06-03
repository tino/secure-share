import { h } from "hyperapp"
import request from "browser-request"
import urls from "../urls"
import nestable from "../nestable"

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const state = {
  id: "",
  name: "",
  expiry: "",
  fields: null,
  error: null
}

const actions = {
  lookupToken(token) {
    return (state, actions) => {
      if (!token) {
        location.actions.go("/")
        return
      }
      if (!(state.data || state.error)) {
        request.get(
          { url: urls["showSecret"].replace("{token}", token), json: true },
          (err, response, body) => {
            if (err) {
              alert(`Couldn't load secret: ${err}`)
              return
            }
            console.debug(response)
            switch (response.statusCode) {
              case 200:
                actions.setSecret(body.data)
                break

              case 404:
                actions.setSecret({ error: "Not found" })

              default:
                break
            }
          },
        )
      }
    }
  },

  setSecret(data) {
    return {
      id: data.id,
      name: data.meta.name,
      expiry: data.expire_time,
    }
  },

  setSecretContents(data) {
    delete data["lease"]
    return { fields: data.fields }
  },

  reveal() {
    return (state, actions) => {
      request.get(
        { url: urls["showSecretContents"].replace("{token}", state.id), json: true },
        (err, response, body) => {
          if (err) {
            alert(`Couldn't load secret contents: ${err}`)
            return
          }
          console.debug(response)
          switch (response.statusCode) {
            case 200:
              actions.setSecretContents(body.data)
              break

            case 404:
              alert("Hmm, secret not found!")

            default:
              break
          }
        },
      )
    }
  },
}

const view = (state, actions) => ({ location, match }) => {
  if (!state.name) actions.lookupToken(match.params.token)
  return (
    <section class="hero is-bold is-success" >
      <div class="hero-body is-text-center">
        <div class="container">
          {!state.name && !state.error && <p>Loading...</p>}
          {state.name && (
            <div>
              <h1>{state.name}</h1>
              <dl>
                <dt>Expires</dt>
                <dd>{state.expiry}</dd>
              </dl>
            </div>
          )}
          {state.fields && (
            <dl>
              {state.fields.reduce((acc, { name, value }, idx) => {
                return acc.concat([
                  <dt>{capitalize(name)}</dt>,
                  <dd>
                    <div class="columns">
                      <div class="column is-10">
                        <div class="control">
                          <input
                            value={value}
                            class="input is-medium"
                            oncreate={e => e.select()}
                            id={`id_${name}`}
                            readonly
                          />
                        </div>
                      </div>
                      <div class="column is-2">
                        <button
                          onclick={e => {
                            document.querySelector(`#id_${name}`).select()
                            document.execCommand("copy")
                          }}
                          class="button is-medium is-white is-outlined"
                        >
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </dd>,
                ])
              }, [])}
            </dl>
          )}
          {state.name &&
            !state.fields && (
              <button class="button is-medium is-danger" onclick={() => actions.reveal()}>
                Reveal
              </button>
            )}
          {state.error && <p>Whoops! {state.error}</p>}
        </div>
      </div>
    </section>
  )
}

export const Show = nestable(state, actions, view)

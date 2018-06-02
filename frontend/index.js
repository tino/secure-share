import { h, app } from "hyperapp"
import { NewForm } from "./secrets/new"
import { Share } from "./secrets/share"
import { Show, showActions } from "./secrets/show"
import { Link, Route, Switch, location } from "@hyperapp/router"
import request from "browser-request"
import urls from "./urls"

import devtools from "hyperapp-devtools"

const state = {
  location: location.state,
  user: null,
  errors: [],
  savedSecret: null,
  settings: {},
  show: { foo: "bar" },
}

const actions = {
  location: location.actions,

  loadSettings: () => state => {
    request.get({ url: urls["settings"], json: true }, (err, response, body) => {
      if (err) {
        alert(`Couldn't load settings: ${err}`)
        return
      }
      if (response.status == 200) {
        actions.setSettings(body)
      }
    })
  },

  setSettings: settings => {
    return state => ({ settings })
  },

  saveNew: ({ name, value }) => (state, actions) => {
    if (!name || !value) {
      throw new Error("Please fill in the name and value")
    }
    request.post(
      {
        url: urls["new"],
        json: { name, value },
      },
      (err, response, body) => {
        if (err) {
          alert(err)
          return false
        }
        if (response.status == 200) {
          actions.displaySaveSuccess(body)
        }
      },
    )
  },

  displaySaveSuccess: savedSecret => {
    actions.location.go("/share")
    return state => ({ savedSecret })
  },

  addError: error => state => ({ errors: state.errors.concat([{ msg: error.message }]) }),

  show: {
    lookupToken(token) {
      return (show, actions) => {
        if (!token) {
          location.actions.go("/")
          return
        }
        if (!(show.data || show.error)) {
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
                  actions.setSecret(body)
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
      return (state, actions) => {
        console.debug(data)
        return data
      }
    },

    reveal() {
      return (showState, actions) => {
        request.get(
          { url: urls["showSecretContents"].replace("{token}", showState.data.id), json: true },
          (err, response, body) => {
            if (err) {
              alert(`Couldn't load secret contents: ${err}`)
              return
            }
            console.debug(response)
            switch (response.statusCode) {
              case 200:
                actions.setSecret({ secret: body })
                break

              case 404:
                actions.setSecret({ error: "Not found" })

              default:
                break
            }
          },
        )
      }
    },
  },
}

const Home = () => {
  return (
    <section class="hero is-bold is-primary">
      <div class="hero-body">
        <div class="container">
          <h1>A way to securely share a secret</h1>
          <h2 class="subtitle">'Cuz keeping secrets all to yourself ain't fun!</h2>
          <div class="level">
            <div class="level-item">
              <Link to="/new" class="button is-medium is-outlined is-link">
                Share a secret 🔐
              </Link>
            </div>
          </div>
          <p>
            Secure Share uses Hashicorp's Vault to store secrets. Secret's can only be retreived
            with the storage url. If you lose the url, there is no way to retrieve the secret, not
            even for the organisation running this service.
          </p>
          <p>
            Extra protections besides the auto-expiring, unguessable url are offered in the form of
            out-of-bound passwords. Secrets can be made "retreivable-once" too, ensuring that
            the secret has not been viewed before.
          </p>
        </div>
      </div>
    </section>
  )
}

const Errors = () => ({ errors }) => {
  if (!errors) return
  return <ul>{errors.map(err => <li class="notification">{err.msg}</li>)}</ul>
}

const view = (state, actions) => (
  <div class="container">
    <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <Link to="/" class="navbar-item">
          <h1 class="title">🔐 SHARE</h1>
        </Link>
      </div>
      <div class="navbar-menu is-active">
        <div class="navbar-end">
        <div class="navbar-item">
          <Link to="/new" class="navbar-link">
            New
          </Link>
        </div>
        </div>
      </div>
    </nav>

    <div class="">
      <Switch>
        <Route path="/" render={Home} />
        <Route path="/new" render={NewForm} />
        <Route path="/share" render={Share} />
        <Route
          parent
          path="/show/:token"
          render={Show({ showState: state.show, showActions: actions.show })}
        />
      </Switch>
      <Errors />
    </div>
  </div>
)

const main = devtools(app)(state, actions, view, document.body)

const unsubscribe = location.subscribe(main.location)
main.loadSettings()

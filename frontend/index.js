import { h, app } from "hyperapp"
// import {withContext} from 'hyperapp-context'
import { NewForm } from "./secrets/new"
import { Share } from "./secrets/share"
import { Show, showActions } from "./secrets/show"
import { Link, Route, Switch, location } from "@hyperapp/router"

import request from "browser-request"
import urls from "./urls"

import devtools from "hyperapp-devtools"
// const devtools = (app) => app

// const app = withContext(_app)

const state = {
  location: location.state,
  user: null,
  errors: [],
  newSecret: null,
  settings: {},
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

  storeNewSecret: newSecret => ({ newSecret }),

  setSettings: settings => {
    return state => ({ settings })
  },

  displaySaveSuccess: savedSecret => {
    actions.location.go("/share")
    return state => ({ savedSecret })
  },

  addError: error => state => ({ errors: state.errors.concat([{ msg: error.message }]) }),
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
            out-of-bound passwords. Secrets can be made "retreivable-once" too, ensuring that the
            secret has not been viewed before.
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
        <Route
          path="/new"
          render={({ location, match }) => (
            <NewForm
              done={secret => {
                actions.storeNewSecret(secret)
                actions.location.go(`/share`)
              }}
            />
          )}
        />
        <Route path="/share" render={Share} />
        <Route parent path="/show/:token" render={Show} />
      </Switch>
      <Errors />
    </div>
  </div>
)

const main = devtools(app)(state, actions, view, document.body)

const unsubscribe = location.subscribe(main.location)
main.loadSettings()

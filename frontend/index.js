import { h, app } from "hyperapp"
import { NewForm } from "./secrets/new"
import { Share } from "./secrets/share"
import { Link, Route, Switch, location } from "@hyperapp/router"
import request from "browser-request"
import urls from "./urls"

const state = {
  location: location.state,
  user: null,
  errors: [],
  savedSecret: null,
}

const actions = {
  location: location.actions,

  saveNew: ({ name, value }) => (state, actions) => {
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
}

const Errors = () => ({ errors }) => {
  if (!errors) return
  return <ul>{errors.map(err => <li class="notification">{err.msg}</li>)}</ul>
}

const view = (state, actions) => (
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <Link to="/" class="navbar-item">
          <h1 class="title">🔐 SHARE</h1>
        </Link>
      </div>
      <Link to="/new" class="navbar-item">
        New
      </Link>
    </nav>

    <div class="tile">
      <Switch>
        <Route
          path="/"
          render={() => {
            ;<div>Hi!</div>
          }}
        />
        <Route path="/new" render={NewForm} />
        <Route path="/share" render={Share} />
      </Switch>
      <Errors />
    </div>
  </div>
)

const main = app(state, actions, view, document.body)

const unsubscribe = location.subscribe(main.location)

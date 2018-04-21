import { h, app } from "hyperapp"
import { NewForm, Other } from "./secrets/new"
import { Link, Route, Switch, location } from "@hyperapp/router"

const state = {
  location: location.state,
  user: null,
}

const actions = {
  location: location.actions,
}

const routing = {
  new: NewForm,
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
      </Switch>
    </div>
  </div>
)

const main = app(state, actions, view, document.body)

const unsubscribe = location.subscribe(main.location)

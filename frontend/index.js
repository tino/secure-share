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

    <div class="">
      <Switch>
        <Route
          path="/"
          render={() => {
            ;<div>Hi!</div>
          }}
        />
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

import { NewForm } from "./secrets/new"
import { Share } from "./secrets/share"
import { Show } from "./secrets/show"
// import { Link, Route, Switch, location } from "@hyperapp/router"
import m from "mithril"

// const state = {
//   location: location.state,
//   user: null,
//   errors: [],
//   newSecret: null,
//   settings: {},
// }

// const actions = {
//   location: location.actions,

//   loadSettings: () => state => {
//     request.get({ url: urls["settings"], json: true }, (err, response, body) => {
//       if (err) {
//         alert(`Couldn't load settings: ${err}`)
//         return
//       }
//       if (response.status == 200) {
//         actions.setSettings(body)
//       }
//     })
//   },

//   storeNewSecret: newSecret => ({ newSecret }),

//   setSettings: settings => {
//     return state => ({ settings })
//   },

//   displaySaveSuccess: newSecret => {
//     location.actions.go("/share")
//     return { newSecret }
//   },

//   addError: error => state => ({ errors: state.errors.concat([{ msg: error.message }]) }),
// }

class Home {
  view() {
    return (
      <section class="hero is-bold is-primary">
        <div class="hero-body">
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
      </section>
    )
  }
}

// const Errors = () => ({ errors }) => {
//   if (!errors) return
//   return <ul>{errors.map(err => <li class="notification">{err.msg}</li>)}</ul>
// }

class Link {
  view(vnode) {
    return (
      <a
        href={vnode.attrs.to}
        onclick={e => {
          m.route.set(vnode.attrs.to)
          e.preventDefault()
        }}
        class={vnode.attrs.class}
      >
        {vnode.children}
      </a>
    )
  }
}

class Layout {
  view(vnode) {
    return (
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

        <div class="page">
          {vnode.children}
        </div>
      </div>
    )
  }
}

let savedSecret = null

const storeSecret = secret => {
  console.log("Done", secret)
  savedSecret = secret
  m.route.set("/share")
}

m.route.prefix("")
m.route(document.body, "/", {
  "/": { view: () => m(Layout, m(Home)) },
  "/new": { view: () => m(Layout, m(NewForm, { storeSecret })) },
  "/share": { view: () => m(Layout, m(Share, { secret: savedSecret })) },
  "/show/:token": {
    onmatch: (args, requestedPath) => {
      console.log(args, requestedPath)
      return { view: () => m(Layout, m(Show)) }
    },
    //
  },
})

import m from "mithril"
import urls from "../urls"

function capitalize(string) {
  return string.split('_').reduce((ret, s) => {
    return ret + ' ' + (s === 'api' ? 'API': s.charAt(0).toUpperCase() + s.slice(1))
  }, '')
}

class Secret {
  constructor(token) {
    this.id = ""
    this.name = ""
    this.expiry = ""
    this.fields = null
    this.error = null

    if (!token) {
      m.route.set("/")
      return
    }
    if (!(this.data || this.error)) {
      m.request({ url: urls["showSecret"].replace("{token}", token) })
        .then(body => {
          this.id = body.data.id
          this.name = body.data.meta.name
          this.expiry = body.data.expire_time
        })
        .catch(err => {
          console.error(err)
          this.error = "Not found"
        })
    }
  }

  reveal() {
    m.request({ url: urls["showSecretContents"].replace("{token}", this.id) })
      .then(body => {
        this.fields = body.data.fields
      })
      .catch(err => {
        console.error(err)
        alert("Hmm, secret not found!")
      })
  }
}

export class Show {
  oninit(vnode) {
    this.secret = new Secret(m.route.param("token"))
    this.copyTexts = []
  }

  view(vnode) {
    return (
      <section class="hero is-bold is-success">
        <div class="hero-body is-text-center">
          <div class="container">
            {!this.secret.name && !this.secret.error && <p>Loading...</p>}
            {this.secret.name && (
              <div>
                <h1 class="title is-1">{this.secret.name}</h1>
                <dl>
                  <dt class="has-text-weight-bold is-size-5">Expires</dt>
                  <dd>{this.secret.expiry}</dd>
                </dl>
              </div>
            )}
            {this.secret.fields && (
              <dl>
                {this.secret.fields.reduce((acc, { name, value }, idx) => {
                  this.copyTexts.push('Copy')
                  return acc.concat([
                    <dt class="has-text-weight-bold is-size-5">{capitalize(name)}</dt>,
                    <dd>
                      <div class="columns">
                        <div class="column is-10">
                          <div class="control">
                            <input
                              value={value}
                              class="input is-medium"
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
                              this.copyTexts[idx] = 'Copied!'
                              setTimeout(() => {
                                this.copyTexts[idx] = 'Copy'
                                m.redraw()
                              }, 2000);
                            }}
                            class="button is-medium is-white is-outlined"
                          >
                            <span>{this.copyTexts[idx]}</span>
                          </button>
                        </div>
                      </div>
                    </dd>,
                  ])
                }, [])}
              </dl>
            )}
            {this.secret.name &&
              !this.secret.fields && (
                <button class="button is-medium is-danger" onclick={() => this.secret.reveal()}>
                  Reveal
                </button>
              )}
            {this.secret.error && <p>Whoops! {this.secret.error}</p>}
          </div>
        </div>
      </section>
    )
  }
}

import m from "mithril"

import urls from "../urls"

const state = {
  name: "",
  field1Type: "username",
  field1Value: "",
  field2Type: "password",
  field2Value: "",
  saving: false,
}

const actions = {
  updateState(update) {
    return update
  },

  saveNew(storeSecret) {
    state.saving = true
    const { name, field1Type, field1Value, field2Type, field2Value } = state
    if (!name) {
      throw new Error("Please fill in a name!")
    }
    if (!(field1Value || field2Value)) {
      throw new Error("Please fill at least one field")
    }
    m.request({
      method: "POST",
      url: urls["new"],
      data: {
        name,
        fields: [
          { name: field1Type, value: field1Value },
          { name: field2Type, value: field2Value },
        ],
      },
    }).then((body) => {
      state.saving = false
      storeSecret(body)
      // m.route.set('/share')
    }).catch(e => {
      state.saving = false
      alert(`An error occured while saving: ${e.message}`)
      return false
    })
  }
}

export class NewForm {
  constructor(vnode) {
    this.storeSecret = vnode.attrs.storeSecret
  }
  save(done) {
    try {
      actions.saveNew(this.storeSecret)
    } catch (error) {
      alert(error)
    }
  }
  view(vnode) {
    return (
      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <form
              class="new-form"
              onsubmit={e => {
                e.preventDefault()
                this.save(vnode.attrs.done)
              }}
              onkeypress={e => {
                const keyCode = e.keyCode || e.which
                if (keyCode === 13) {
                  e.preventDefault()
                  this.save(vnode.attrs.done)
                }
              }}
            >
              <div class="field">
                <label class="label">Name</label>
                <div class="control">
                  <input
                    class="input is-large"
                    name="name"
                    type="text"
                    placeholder="Eg. &quot;New email account for John&quot;"
                    value={state.name}
                    oninput={e => state.name = e.target.value }
                    oncreate={e => e.dom.focus()}
                  />
                  <span class="is-size-6 has-text-danger">
                    Don't put any sensitive information in this field!
                  </span>
                </div>
              </div>
              <hr />
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <div className="select">
                    <select
                      name="field1Type"
                      oninput={e => state.field1Type = e.target.value }
                      id=""
                    >
                      <option value="username">Username</option>
                      <option value="api_token">API token</option>
                    </select>
                  </div>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <input
                        class="input is-medium"
                        name="value"
                        type="text"
                        placeholder="a secret value"
                        oninput={e => state.field1Value = e.target.value }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <div className="select">
                    <select
                      name="field2Type"
                      oninput={e => state.field2Type = e.target.value }
                      id=""
                    >
                      <option value="password">Password</option>
                      <option value="api_secret">API secret</option>
                    </select>
                  </div>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <input
                        class="input is-medium"
                        name="value"
                        type="text"
                        placeholder="a secret value"
                        oninput={e => state.field2Value = e.target.value }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit row */}
              <div class="level">
                <div class="level-left" />
                <div class="level-right">
                  <div class="level-item">
                    <div class="field is-grouped">
                      <div class="control">
                        <button
                          onclick={e => {
                            location.go("/")
                            e.preventDefault()
                          }}
                          class="button is-text"
                        >
                          Cancel
                        </button>
                      </div>
                      <div class="control">
                        <input
                          type="submit"
                          class="button is-link"
                          value="Submit"
                          disabled={state.saving}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}

import { h } from "hyperapp"
import { location } from "@hyperapp/router"
import request from "browser-request"
import nestable from "../nestable"
import urls from "../urls"

export const NewForm = nestable(
  // STATE
  {
    name: "",
    field1Type: "username",
    field1Value: "",
    field2Type: "password",
    field2Value: "",
  },

  // ACTIONS
  {
    updateState(update) {
      return update
    },
    saveNew: () => (state, actions) => {
      const { name, field1Value, field2Value } = state
      if (!name) {
        throw new Error("Please fill in a name!")
      }
      if (!(field1Value || field2Value)) {
        throw new Error("Please fill at least one field")
      }
      request.post(
        {
          url: urls["new"],
          json: { name, field1Value, field2Value },
        },
        (err, response, body) => {
          if (err) {
            alert(err)
            return false
          }
          if (response.status == 200) {
            location.actions.go(`/share#${body}`)
          }
        },
      )
    },
  },

  // VIEW
  (state, actions) => ({ addError }, _) => {
    return (
      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <form
              class="new-form"
              onsubmit={e => {
                try {
                  actions.saveNew()
                } catch (error) {
                  addError(error)
                }
                e.preventDefault()
              }}
              onkeypress={e => {
                const keyCode = e.keyCode || e.which
                if (keyCode === 13) {
                  actions.submit()
                  e.preventDefault()
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
                    oninput={e => actions.updateState({ name: e.target.value })}
                    oncreate={e => e.focus()}
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
                      oninput={e => actions.updateState({ field1Type: e.target.value })}
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
                        oninput={e => actions.updateState({ field1Value: e.target.value })}
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
                      oninput={e => actions.updateState({ field2Type: e.target.value })}
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
                        oninput={e => actions.updateState({ field2Value: e.target.value })}
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
                        <input type="submit" class="button is-link" value="Submit" />
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
  },
)

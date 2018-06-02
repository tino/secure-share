import { h } from "hyperapp"

export const NewForm = () => (_, { saveNew, addError, location }) => {
  const localState = {
    name: "",
    value: "",
  }

  function updateState(param, value) {
    localState[param] = value
  }
  const submit = () => {
    try {
      saveNew(localState)
    } catch (error) {
      addError(error)
    }
  }

  return (
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <form
            class="new-form"
            onsubmit={e => {
              submit()
              e.preventDefault()
            }}
            onkeypress={e => {
              const keyCode = e.keyCode || e.which
              if (keyCode === 13) {
                submit()
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
                  oninput={e => updateState("name", e.target.value)}
                  oncreate={e => e.focus()}
                />
                <span class="is-size-6 has-text-danger">
                  Don't put any sensitive information in this field!
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Value</label>
              <div class="control">
                <input
                  class="input is-medium"
                  name="value"
                  type="text"
                  placeholder="The password"
                  oninput={e => updateState("value", e.target.value)}
                />
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <input type="submit" class="button is-link" value="Submit" />
              </div>
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
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

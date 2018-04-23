import { h } from "hyperapp"

export const NewForm = () => (_, { saveNew, addError }) => {
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
            placeholder="Eg. &quot;password for account X&quot;"
            oninput={e => updateState("name", e.target.value)}
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
          <button class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button class="button is-text">Cancel</button>
        </div>
      </div>
    </form>
  )
}

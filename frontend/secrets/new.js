import { h } from "hyperapp"

export const NewForm = () => (
  <form action="" method="POST">
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input is-large"
          name="name"
          type="text"
          placeholder="Eg. password for account X"
        />
        <span class="is-size-6 has-text-danger">
          Don't put any sensitive information in this field!
        </span>
      </div>
    </div>
    <div class="field">
      <label class="label">Value</label>
      <div class="control">
        <input class="input is-medium" name="value" type="text" placeholder="The password" />
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

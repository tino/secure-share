import { h } from "hyperapp"
import { location } from "@hyperapp/router"
import urls from "../urls"

export const Share = () => ({ settings, newSecret }) => {
  let copyButtonText = "Copy"
  if (newSecret) {
    const scheme = window.location.href.split(":")[0]
    const domain = window.location.href.split("/")[2]
    const url = `${scheme}://${domain}/show/${newSecret.token}`
    return (
      <section class="hero is-bold is-success">
        <div class="hero-body is-text-center">
          <div class="container">
            <dl>
              <dt>URL</dt>
              <dd>
                <div class="columns">
                  <div class="column is-10">
                    <div class="control">
                      <input
                        class="input is-medium"
                        name="value"
                        id="urlInput"
                        type="text"
                        value={url}
                        oncreate={e => e.select()}
                        readonly
                      />
                    </div>
                  </div>
                  <div class="column is-2">
                    <button
                      onclick={(e) => {
                        document.querySelector("#urlInput").select()
                        document.execCommand("copy")
                        copyButtonText = "Copied!"
                      }}
                      class="button is-medium is-white is-outlined"
                    >
                      <span>{copyButtonText}</span>
                    </button>
                  </div>
                </div>
              </dd>

              <dt>Valid until</dt>
              <dd>{newSecret.expiration}</dd>
            </dl>
          </div>
        </div>
      </section>
    )
  } else {
    location.actions.go("/new")
  }
}

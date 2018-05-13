import { h } from "hyperapp"
import { location } from "@hyperapp/router"
import urls from "../urls"

export const Share = () => ({ settings, savedSecret }) => {
  let copyButtonText = "Copy"
  if (savedSecret) {
    const url = urls.showSecret.replace("{token}", savedSecret.token)
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
                        onclick={(e) => e.target.select()}
                        oncreate={e => e.select()}
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
                      <span class="icon">
                        <i class="fas fa-copy" />
                      </span>{" "}
                      <span>{copyButtonText}</span>
                    </button>
                  </div>
                </div>
              </dd>

              <dt>Valid until</dt>
              <dd>{savedSecret.expiration}</dd>
            </dl>
          </div>
        </div>
      </section>
    )
  } else {
    location.actions.go("/new")
  }
}

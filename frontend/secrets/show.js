import { h } from "hyperapp"
import urls from "../urls"
import request from "browser-request"

export const Show = ({ showState, showActions }) => ({ match }) => (
  <section class="hero is-bold is-success" oncreate={showActions.lookupToken(match.params.token)}>
    <div class="hero-body is-text-center">
      <div class="container">
        {showState &&
          showState.data && (
            <dl>
              <dt>Expires</dt>
              <dd>{showState.data.expire_time}</dd>
            </dl>
          )}
        {showState.secret && (
          <dl>
            <dt>Name</dt>
            <dd>{showState.secret.data.name}</dd>
            <dt>Value</dt>
            <dd>
              <div class="columns">
                <div class="column is-10">
                  <div class="control">
                    <input
                      value={showState.secret.data.value}
                      class="input is-medium"
                      onclick={e => e.target.select()}
                      oncreate={e => e.select()}
                      id="secret"
                    />
                  </div>
                </div>
                <div class="column is-2">
                  <button
                    onclick={e => {
                      document.querySelector("#secret").select()
                      document.execCommand("copy")
                    }}
                    class="button is-medium is-white is-outlined"
                  >
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </dd>
          </dl>
        )}
        {showState && !showState.data && !showState.error && <p>Loading...</p>}
        {showState.error && <p>Whoops! {showState.error}</p>}
        {showState.data &&
          !showState.secret && (
            <button class="button is-medium is-danger" onclick={() => showActions.reveal()}>
              Reveal
            </button>
          )}
      </div>
    </div>
  </section>
)

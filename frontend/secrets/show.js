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
            <dd>{showState.secret.data.value}</dd>
          </dl>
        )}
        {showState && !showState.data && !showState.error && <p>Loading...</p>}
        {showState.error && <p>Whoops! {showState.error}</p>}
        {!showState.secret && <button onclick={() => showActions.reveal()}>Reveal</button>}
        {/* <pre>{JSON.stringify(showState)}</pre> */}
      </div>
    </div>
  </section>
)

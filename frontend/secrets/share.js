import { h } from "hyperapp"
import { location } from "@hyperapp/router"
import urls from "../urls"

export const Share = () => ({ settings, savedSecret }) => {
  if (savedSecret) {
    return (
      <section class="hero is-bold is-success">
        <div class="hero-body is-text-center">
          <div class="container">
            <dl>
              <dt>URL</dt>
              <dd>{`${urls["show-secret"]}${savedSecret.token}`}</dd>
              {/* <dd>{`${settings.base_url}${savedSecret.url}`}</dd> */}
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

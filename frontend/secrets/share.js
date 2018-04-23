import { h } from "hyperapp"
import { location } from "@hyperapp/router"

export const Share = () => ({ savedSecret }) => {
  if (savedSecret) {
    return (
      <dl>
        <dt>URL</dt>
        <dd>{savedSecret.url}</dd>
        <dt>Valid until</dt>
        <dd>{savedSecret.expiration}</dd>
      </dl>
    )
  } else {
    location.actions.go("/new")
  }
}

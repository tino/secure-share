import m from "mithril"

let copyButtonText = "Copy"
function copyUrl() {
  document.querySelector("#urlInput").select()
  document.execCommand("copy")
  copyButtonText = "Copied!"
  setTimeout(() => {
    copyButtonText = "Copy"
    m.redraw()
  }, 2000)
}

export class Share {
  view(vnode) {
    const secret = vnode.attrs.secret
    if (!secret) {
      m.route.set("/new")
      return
    }

    const scheme = window.location.href.split(":")[0]
    const domain = window.location.href.split("/")[2]
    const url = `${scheme}://${domain}/show/${secret.token}`
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
                        oncreate={e => e.dom.select()}
                        readonly
                      />
                    </div>
                  </div>
                  <div class="column is-2">
                    <button onclick={copyUrl} class="button is-medium is-white is-outlined">
                      <span>{copyButtonText}</span>
                    </button>
                  </div>
                </div>
              </dd>

              <dt>Valid until</dt>
              <dd>{secret.expiration}</dd>
            </dl>
          </div>
        </div>
      </section>
    )
  }
}

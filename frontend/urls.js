const base_url = "http://localhost:5000"
const urls = {
  new: `${base_url}/api/secrets/new`,
  settings: `${base_url}/api/settings`,
  show: `${base_url}/show`,
  showSecret: `${base_url}/api/secrets/show/{token}`,
  showSecretContents: `${base_url}/api/secrets/show/{token}/contents`,
}

export default urls

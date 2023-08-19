export const isValidUrl = () => {
  const protocol = "(?:(?:https?)://)"
  const notIpv4 =
    "(?!:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))"
  const hostname = "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)"
  const domain =
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*"
  const tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))"
  const port = "(?::\\d{2,5})?"
  const resourcePath = "(?:[/?#]\\S*)?"
  const notLocalhost = "(?!:localhost)"
  const regex = `${protocol}(${notLocalhost}|${notIpv4}|${hostname}${domain}${tld}\\.?)${port}${resourcePath}`
  const isUrl = new RegExp(`^${regex}$`, "i")

  return isUrl
}

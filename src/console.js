const Console = () => {}

Console.callback = undefined
Console.logs = []

Console.push = function ({ config, request, status }) {
  Console.logs.push({
    responseCode: status,
    baseUrl: config.baseURL,
    method: config.method.toUpperCase().substr(0, 3),
    url: config.url.substr(config.baseURL.length),
    timestamp: new Date().toUTCString()
  })
  Console.callback(Console.logs)
}

Console.initialize = (callback) => {
  Console.callback = callback
}

export default Console

import { webSocket } from 'rxjs/webSocket'

export function createWebSocket(path, query) {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const uri = new URL(`${protocol}//${location.host}/${path}`)
  Object
    .entries(query)
    .forEach(([key, value]) => {
      uri.searchParams.append(key, value)
    })
	return new webSocket({ 
    url: uri.toString(),
    serializer: t => t,
    deserializer: t => t
  })
}
import { createWebSocket } from './local-ws'

export function listenerStream() {
  const ws$ = createWebSocket('ws/student' + location.search, {})
  return ws$
}
import { createWebSocket } from './local-ws'

// only for send audio data to server
export function speakerStream() {
  const ws$ = createWebSocket('ws/teacher' + location.search, {})
  // const ws$ = createWebSocket('ws/voice' + location.search, {})
  return ws$
}
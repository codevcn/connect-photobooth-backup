import { TLoggingWorkerInput } from '@/utils/types/worker'

const logsStorageEndpoint = 'https://private-log-server-production.up.railway.app/api/logs'

self.onmessage = async (e) => {
  const data = e.data as TLoggingWorkerInput
  const abortController = new AbortController()
  fetch(logsStorageEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: abortController.signal,
  })
    .then(() => {
      console.log('>>> Succeed to send log entry:', data)
    })
    .catch((error) => {
      console.error('>>> Failed to send log entry:', error)
    })
  setTimeout(() => {
    abortController.abort()
  }, 10000)
}

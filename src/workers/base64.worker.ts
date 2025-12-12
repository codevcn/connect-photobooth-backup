/// <reference lib="webworker" />

import { TBase64WorkerInput, TBase64WorkerOutput } from '@/utils/types/worker'

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000 // 32 KB per chunk
  let binary = ''

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }

  return btoa(binary)
}

const createWorkerOutput = (data: TBase64WorkerOutput): TBase64WorkerOutput => {
  return data
}

self.onmessage = async (e) => {
  const data = e.data as TBase64WorkerInput
  const blob = data.blob
  if (!blob) return

  const reader = new FileReader()

  reader.onload = () => {
    const arrayBuffer = reader.result as ArrayBuffer
    const base64 = arrayBufferToBase64(arrayBuffer)
    self.postMessage(
      createWorkerOutput({
        base64FromURL: base64,
        originalURL: data.url,
      })
    )
  }

  reader.onerror = (err) => {
    self.postMessage(createWorkerOutput({ errorMessage: 'Lỗi đọc Blob để chuyển sang Base64' }))
  }

  reader.readAsArrayBuffer(blob)
}

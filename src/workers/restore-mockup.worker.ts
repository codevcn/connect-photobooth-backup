/// <reference lib="webworker" />

import { convertBlobTypeToFileExtension } from '@/utils/helpers'
import { TRestoreMockupWorkerInput } from '@/utils/types/worker'

const restoreMockupEndpoint: string = 'http://localhost:4000/api/mockup/restore'

const sendRestoreMockupDataToServer = async (data: TRestoreMockupWorkerInput) => {
  const formData = new FormData()

  const { localBlobURLsCache, ...mainData } = data
  formData.set('main_data', JSON.stringify(mainData))
  for (const blobURL in localBlobURLsCache) {
    const blob = localBlobURLsCache[blobURL]
    formData.append(
      'local_blob_urls',
      blob,
      `${blobURL}${convertBlobTypeToFileExtension(blob.type)}`
    )
  }

  await fetch(restoreMockupEndpoint, {
    method: 'POST',
    body: formData,
  })
}

self.onmessage = async (e) => {
  const data = e.data as TRestoreMockupWorkerInput
  console.log('>>> [resm] data at restore mockup [worker]:', data)
  if (!data) return

  try {
    await sendRestoreMockupDataToServer(data)
    console.log('>>> [resm] restore mockup [worker] sent successfully')
  } catch (error) {
    console.error('>>> [resm] restore mockup [worker] error:', error)
  }
}

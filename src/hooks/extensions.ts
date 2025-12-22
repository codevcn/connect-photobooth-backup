export const useQueryFilter = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    isPhotoism: params.get('q') === 'ptm',
    q: params.get('q') || '',
    dvid: params.get('divid') || '',
    device: params.get('device') || '',
    funId: params.get('funstudio'),
    dev: params.get('dev') === '123',
    isMobileDevice: params.get('device') === 'mobile',
  }
}

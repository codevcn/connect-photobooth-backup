import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
  return useSearchParams()[0].get('q') === 'ptm'
}

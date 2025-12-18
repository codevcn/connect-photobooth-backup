import type { NavigateFunction } from 'react-router-dom'

export const createQueryStringInURL = (): string => {
  const searchParams = new URLSearchParams(window.location.search)
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

export class AppNavigator {
  static navTo(navigate: NavigateFunction, path: string) {
    const queryString = createQueryStringInURL()
    navigate(`${path}${queryString ? createQueryStringInURL() : ''}`)
  }
}

import useSWR from 'swr'
import axios from 'axios'
import { API_URL } from '../constants'

export function useFetchData<T>(endpoint: string | undefined) {
  const address = endpoint && `${API_URL}${endpoint}`
  const fetcher = async (url: string) => await axios.get<T>(url).then((res) => res.data)
  return useSWR<T>(address, fetcher)
}


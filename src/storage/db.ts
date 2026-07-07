import { createStore, get, set, del } from 'idb-keyval'

const store = createStore('family-movie-concierge', 'app-data')

export const db = {
  get: <T>(key: string) => get<T>(key, store),
  set: <T>(key: string, value: T) => set(key, value, store),
  del: (key: string) => del(key, store),
}

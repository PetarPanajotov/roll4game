export type Game = {
  id: number
  name: string
  cover?: Cover
  first_release_date?: number
  summary?: string
  url?: string
}

type Cover = {
  height: number
  id: number
  image_id: string
  width: number
  url: string
}

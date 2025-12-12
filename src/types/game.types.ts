export type Game = {
  id: number
  aggregated_rating?: number
  aggregated_rating_count?: number
  name: string
  cover?: Cover
  first_release_date?: number
  summary?: string
  rating?: number
  rating_count?: number
  url?: string
}

type Cover = {
  height: number
  id: number
  image_id: string
  width: number
  url: string
}

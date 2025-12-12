export interface IgdbGame {
  id: number
  aggregated_rating?: number
  aggregated_rating_count?: number
  name: string
  first_release_date?: number
  summary?: string
  cover?: IgdbCover
  genres?: IgdbGenre[]
  platforms?: IgdbPlatform[]
  screenshots?: IgdbScreenshot[]
  videos?: IgdbVideo[]
  rating?: number
  rating_count?: number
  url: string
}

export interface IgdbCover {
  id: number
  alpha_channel?: boolean
  animated?: boolean
  game?: number
  height?: number
  width?: number
  image_id: string
  url: string
  checksum?: string
}

export interface IgdbGenre {
  id: number
  name: string
}

export interface IgdbPlatform {
  id: number
  name: string
}

export interface IgdbScreenshot {
  id: number
  alpha_channel?: boolean
  animated?: boolean
  game?: number
  height?: number
  width?: number
  image_id: string
  url: string
  checksum?: string
}

export interface IgdbVideo {
  id: number
  game?: number
  name?: string
  video_id: string
  checksum?: string
}

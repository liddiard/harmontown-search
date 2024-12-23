export interface Episode {
  number: number
  title: string
  description: string
  record_date?: string
  release_date: string
  audio_link: string
  video_id?: string
}

export type EpisodeList = Episode[]

export interface TranscriptLine {
  start: number
  end: number
  text: string
}

export type Transcript = TranscriptLine[]

export interface QueryParams {
  [key: string]: string
}

export enum MediaType {
  Audio,
  Video,
}

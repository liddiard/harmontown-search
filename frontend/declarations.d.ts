import { EpisodeList, Transcript } from '@/types'

// https://stackoverflow.com/a/59728984/2487925
declare global {
  declare module '*/episode_list.tsv' {
    const content: EpisodeList
    export default content
  }

  declare module '*/transcripts/*.tsv' {
    const content: Transcript
    export default content
  }
}

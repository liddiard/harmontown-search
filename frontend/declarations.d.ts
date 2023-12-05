import { Episode } from '@/constants'

// https://stackoverflow.com/a/59728984/2487925
declare global {
  declare module '*/episode_list.tsv' {
    const content: Episode[]
    export default content
  }
}

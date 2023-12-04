import { Episode } from '@/constants'

declare module '*.tsv' {
  const content: Episode[]
  export default content
}
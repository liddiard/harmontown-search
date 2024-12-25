import content from './content.md'
import markdownit from 'markdown-it'

import s from './page.module.scss'

export default function About() {
  const md = markdownit({
    html: true,
    typographer: true,
  })
  const result = md.render(content)

  return (
    <article className={s.about} dangerouslySetInnerHTML={{ __html: result }} />
  )
}

const highlightMatches = (result, query) =>
  query
  .trim()
  .split(/\s+/)
  .reduce((acc, cur) =>
    acc.replace(new RegExp(`(${cur})`, 'gi'), '<em>$1</em>'), result)

export default function EpisodeResult({
  result,
  query
}) {
  const {
    title,
    description,
    number,
    record_date,
    release_date 
  } = result;
  const date = record_date || release_date
  const formattedDate = Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric' 
  }).formatToParts(new Date(date))
  return (
    <li>
      <div className="title">
        <h3 dangerouslySetInnerHTML={{
          __html: highlightMatches(title, query)
        }} />
        <span className="episode">Ep <span className="number">{number}</span></span>
        <time dateTime={date}>
          {formattedDate.slice(0, -1).map(p => p.value).join('')}
          <span className="year">
            {formattedDate[formattedDate.length-1].value}
          </span>
        </time>
      </div>
      <p dangerouslySetInnerHTML={{
        __html: highlightMatches(description, query).replace(/\\n/g, ' ')
      }} />
    </li>
  )
}
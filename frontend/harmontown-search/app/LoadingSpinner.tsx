import s from './LoadingSpinner.module.scss'

export default function LoadingSpinner({
  loading,
  className = ''
}) {
  return loading ?
    <div className={`${s.loadingSpinner} ${className}`} />
    : null
}
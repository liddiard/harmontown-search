import classNames from 'classnames'

import s from './LoadingSpinner.module.scss'


interface LoadingSpinnerProps {
  loading: boolean,
  className: string
}

export default function LoadingSpinner({
  loading,
  className = ''
} : LoadingSpinnerProps) {
  return loading ?
    <div className={classNames(s.loadingSpinner, className)} />
    : null
}
import { ReactNode } from 'react'
import classNames from 'classnames'

import s from './Toast.module.scss'


interface ToastProps {
  duration: number,
  children: ReactNode
  className?: string
}

export default function Toast({
  duration,
  children,
  className = ''
} : ToastProps) {
  return (
    <output
      className={classNames(s.toast, className)}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </output>
  )
}
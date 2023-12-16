import s from './Toast.module.scss'


interface ToastProps {
  message: string,
  buttonText: string,
  duration: number,
  buttonAction: () => void
}

export default function Toast({
  message,
  buttonText,
  duration,
  buttonAction
} : ToastProps) {
  return (
    <output className={s.toast} style={{ animationDuration: `${duration}ms` }}>
      {message}
      <button onClick={buttonAction}>
        {buttonText}
      </button>
    </output>
  )
}
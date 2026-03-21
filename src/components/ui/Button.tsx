import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
  }
>

export const Button = ({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const classes = ['ui-button', `ui-button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  )
}

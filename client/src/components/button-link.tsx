import Link from 'next/link'

interface Props {
  className?: string
  href?: string
  type?: string
  children?: any
}

export function ButtonLink({
  className = "",
  href = "#",
  type = "default",
  children = undefined,
}: Props) {
  let btnClass = 'bg-primary text-primary-foreground'
  switch (type) {
    case 'success':
      btnClass = 'bg-green-700 text-white'
      break
    case 'danger':
      btnClass = 'bg-red-700 text-white'
      break
    case 'warning':
      btnClass = 'bg-yellow-500 text-black'
      break
  }
  return (
    <Link
      href={href}
      className={`px-2 py-1 rounded-md hover:opacity-50 ${btnClass} ${className} `}
    >
      {children}
    </Link>)
}

export default ButtonLink
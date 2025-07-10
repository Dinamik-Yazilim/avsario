import Link from 'next/link'

export type IconProps = React.HTMLAttributes<SVGElement> & { width?: number, height?: number }

export const HeaderLogo2 = ({
  className,
}: { className?: string }) => {
  return (
    <div className={`flex flex-row text-xl items-center m11ax-h-12 font-semibold  ${className}`}>
      <img src="/img/logo.png" alt="logo" className="" />
    </div>
  )
}
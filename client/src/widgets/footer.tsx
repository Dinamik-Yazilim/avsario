import Link from 'next/link'
import CustomLink from "@/components/custom-link"
import packageJSON from "next-auth/package.json"

export default function Footer({className}:{className?:string}) {
  return (
    <footer className={`w-full ${className}`}>
      <div className='grid grid-cols-1 md11:gr11id-cols-2'>
        <div className='flex flex-row  flex-wrap flex-grow space-x-4 items-center justify-center text-muted-foreground text-xs ms-1 me-4'>
          <CustomLink href="#">About</CustomLink>
          <CustomLink href="#">Status</CustomLink>
          <CustomLink href="#">Docs</CustomLink>
        </div>
      </div>


    </footer>
  )
}

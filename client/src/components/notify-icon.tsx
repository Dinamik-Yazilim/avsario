"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
}
export function NotificationButton({ }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='cursor-pointer relative'>
          <span className='text-2xl drop-shadow-[1px_1px_1px_black] dark:drop-shadow-none' >🔔</span>
          <div className='text-[10px] font-bold px-[4px] py-[4px] rounded-full absolute top-[-8px] end-[16px] bg-green-800 text-white'>93+</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>fidifeireir</DropdownMenuItem>
        <DropdownMenuItem>sdfkdfkd</DropdownMenuItem>
        <DropdownMenuItem>345345dfgdf</DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
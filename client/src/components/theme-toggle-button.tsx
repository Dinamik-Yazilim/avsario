"use client"

// import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import Link from 'next/link'
export interface ThemeToggleButtonProps {
  className?: string
  title?: string
}
export function ThemeToggleButton({
  className = '',
  title = 'For a greener 🌍Earth, please use 🌙Dark Mode'
}: ThemeToggleButtonProps) {
  const { theme, setTheme } = useTheme()

  return (

    // <div
    //   onClick={(e) => {
    //     theme === 'light' ? setTheme("dark") : setTheme("light")
    //   }}
    //   className={`cursor-pointer ps-1 pe-2 py-1 border rounded ${className}`}
    //   title={title}
    // >
    <Button
      variant="outline" size="sm" onClick={(e) => {
        theme === 'light' ? setTheme("dark") : setTheme("light")
      }}
      className={`${className}`}
      title={title}
    >
      {theme === 'light' && <MoonIcon />}
      {theme != 'light' && <SunIcon />}

    </Button>

  )
}
{/* */ }
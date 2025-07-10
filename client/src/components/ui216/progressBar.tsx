"use client"

import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  max?: number
  position?: number
  percent?: number
  caption?: string

}
interface Props {
  className?: string
  eventName?: string
  title?:React.ReactNode | any
  onProgress?: (e: ProgressBarProps) => void
  onFinished?: () => void
}
export function ProgressBar({ className, eventName, title, onProgress, onFinished }: Props) {
  const [token, setToken] = useState('')
  const [wsSubscribed, setWsSubscribed] = useState(false)
  const [progress, setProgress] = useState<ProgressBarProps>({})

  const load = () => {
    try {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URI || '')
      ws.onopen = () => {
        ws.send(JSON.stringify({ event: 'subscribe', token: token }))
      }
      ws.onmessage = (msg) => {
        let data = JSON.parse(msg.data)
        switch (data.event) {
          case 'subscribed':
            if (msg.data.success) {
              setWsSubscribed(true)
            } else {
              setWsSubscribed(false)
            }
            break
          case eventName || 'progress':
            const d = {
              max: data.max || 0,
              position: data.position || 0,
              percent: data.percent || 0,
              caption: data.caption || '',
            } as ProgressBarProps
            setProgress(d)
            onProgress && onProgress(d)
            break
          case `${(eventName || 'progress')}_end`:
            onFinished && onFinished()
            break
        }
        // console.log('Message received:', data)
      };
      ws.onclose = () => {
        console.log('WebSocket connection closed')
      }
    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  return (<div className={`w-full  flex flex-col gap-0 bg-sla11te-800 ro11unded-lg bor11der bord11er-dashed p11-2 ${className}`}>
    <div className="w-full text-center ">{title}</div>
    <div className="w-full relative">
      <Progress className="h-8 bg-amber-700" value={progress.percent || 0}  />
      <div className="absolute top-1 w-full text-center text-primary-foreground">{progress.caption}</div>
    </div>
  </div>)
}
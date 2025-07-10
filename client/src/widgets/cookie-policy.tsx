import React, { FC } from 'react'

export const CookiePolicy: FC<React.ReactNode> = () => {
  return (
    <div className="z-[999999999] fixed bottom-0 left-0 md:bottom-4 md:left-4 py-6 px-4 md:p-4 flex gap-8 md:rounded-xl bg-l-g-3 border-t md:border border-l-g-7 text-l-g-10 text-b-sm-r max-w-full md:max-w-xl" data-v-51412ab1=""><div><div className="text-b-lg-s mb-2">
      This website uses cookies 🍪
    </div>
      <p>
        We use cookies to offer you a better browsing experience, analyze site traffic and personalize content. By using our site, you consent to our <a href="/cookies" target="_blank" className="text-l-a border-b border-transparent hover:border-l-a transition">use of cookies</a>.
      </p>
    </div>
      <div className="cursor-pointer p-1">
        <svg width="24px" height="24px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-l-g-10 w-4 h-4"><path d="M27.3938 24L37.697 13.6969C38.6345 12.7594 38.6345 11.2406 37.697 10.3031C36.7595 9.3656 35.2407 9.3656 34.3032 10.3031L24.0001 20.6062L13.697 10.3031C12.7595 9.3656 11.2407 9.3656 10.3032 10.3031C9.36572 11.2406 9.36572 12.7594 10.3032 13.6969L20.6063 24L10.3032 34.3031C9.36572 35.2406 9.36572 36.7594 10.3032 37.6969C10.772 38.1656 11.386 38.4 12.0001 38.4C12.6142 38.4 13.2282 38.1656 13.697 37.6969L24.0001 27.3937L34.3032 37.6969C34.772 38.1656 35.386 38.4 36.0001 38.4C36.6142 38.4 37.2282 38.1656 37.697 37.6969C38.6345 36.7594 38.6345 35.2406 37.697 34.3031L27.3938 24Z" fill="currentColor"></path></svg>
      </div>
    </div>
  )
}
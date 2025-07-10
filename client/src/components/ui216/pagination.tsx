"use client"

import { PaginationType } from '@/types/PaginationType'
import Link from 'next/link'
import React, { FC, useEffect, useState } from "react"


interface PaginationProps {
  className?: string
  pagination?: PaginationType

  onPageClick?: Function
}

const Pagination: FC<PaginationProps> = ({
  className = "",
  pagination,
  onPageClick
}) => {
  const buttonList = Array.from(Array(pagination?.pageCount).keys())


  return (
    <div className={`flex flex-row w-full items-center justify-between gap-1 text-xs md:gap-2 md:text-base font-medium`}>
      <div className='flex flex-row items-center justify-center gap-2 px-2 py-2 rounded-md border border-dashed text-gray-500 w-20'
        title={`Total Documents:${pagination?.totalDocs}`}>
        <div>{pagination?.totalDocs}</div>
        <div><i className="fa-solid fa-book-open"></i></div>
      </div>
      <div className='flex gap-2 text-sm'>
        {buttonList.map((no, index) => {
          no = no + 1
          if (no == pagination?.page) {
            return <span
              key={index}
              className={`inline-flex w-8 h-8 items-center justify-center rounded-full bg-gray-400 font-bold dark:bg-primary-foreground`}
            >
              {no}
            </span>
          } else {
            return <Link
              href="#"
              key={index}
              className={`inline-flex w-8 h-8 items-center justify-center rounded-full bg-neutral-600 hover:bg-neutral-300 border border-neutral-900 text-neutral-600 dark:text-neutral-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700`}
              onClick={(e) => {
                e.preventDefault()
                if (onPageClick != undefined) {
                  onPageClick(no)
                }
              }}
            >{no}</Link>
          }
        })}
      </div>

    </div>
  )
}

export default Pagination

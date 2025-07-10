"use client"

import { ReactNode, useState } from 'react'


interface OptionProps {
  type?: 'List' | 'Update'
  // paging?: boolean
  showSearch?: boolean
  showAddNew?: boolean
  showEdit?: boolean
  showDelete?: boolean

}
interface Props {
  // headers?: ReactNode[]
  // cells?: GridCellType[]
  onHeaderPaint?: () => ReactNode
  onRowPaint?: (e: any, rowIndex: number) => ReactNode
  list?: any[]

}
export function TsnLineGrid({
  // headers = [],
  onRowPaint,
  onHeaderPaint,
  list

}: Props) {

  const classBgOdd = 'bg-slate-300 bg-opacity-10 hover:bg-blue-500 hover:bg-opacity-10'
  const classBgEven = 'hover:bg-blue-500 hover:bg-opacity-10'

  return (<div className='w-full flex flex-col'>
    {onHeaderPaint &&
      <div className='w-full flex flex-row items-center border-b mb-1 p-1'>
        <div className='text-slate-500 w-full font-semibold text-sm'>{onHeaderPaint()}</div>
      </div>
    }
    <div >
      {list && list.map((e: any, index: number) => (<>

        {!e.deleted && <div key={(e._id || 'grid' + index)} className={`w-full flex flex-row items-center rounded my-1 p-1 text-sm ${index % 2 == 1 ? classBgOdd : classBgEven}`}>
          {onRowPaint && onRowPaint(e, index)}
        </div>
        }
      </>))}
    </div>

  </div>)
}


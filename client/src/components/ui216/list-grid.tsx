"use client"

import { FC, ReactNode, useEffect, useState } from 'react'
import { deleteItem, getItem, getList } from '@/lib/fetch'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { PaginationType } from '@/types/PaginationType'
import { useLanguage } from '@/i18n'
import Loading from '@/components/loading'

import { Input } from '@/components/ui/input'
import { EditIcon, FilterIcon, PlusSquareIcon, Trash2Icon } from 'lucide-react'
import Pagination from '@/components/ui216/pagination'
import { ButtonConfirm } from '@/components/button-confirm'
import { FilterPanel } from './filter-panel'

interface OptionProps {
  type?: 'List' | 'Update'
  paging?: boolean
  showSearch?: boolean
  showAddNew?: boolean
  showEdit?: boolean
  showDelete?: boolean

}
interface Props {
  // headers?: ReactNode[]
  // cells?: GridCellType[]
  apiPath?: string,
  onHeaderPaint?: () => ReactNode
  onRowPaint?: (e: any, colIndex: number) => ReactNode
  onDelete?: (e: any) => void
  options?: OptionProps
  title?: any
  onFilterPanel?: (e: any, setFilter: (a: any) => void) => ReactNode
  defaultFilter?: any
  params?: any
  icon?:React.ReactNode
}
export function ListGrid({
  // headers = [],
  apiPath = '',
  onRowPaint,
  onHeaderPaint,
  onDelete,
  options = {},
  title,
  onFilterPanel,
  defaultFilter = {},
  params,
  icon
}: Props) {
  const [list, setList] = useState<any[]>([])
  const [filter, setFilter] = useState<any>(defaultFilter)
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathName = usePathname()
  const [pagination, setPagination] = useState<PaginationType>({ pageCount: 0, page: 1, pageSize: 10, totalDocs: 0 })
  const [search, setSearch] = useState('')
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  options = Object.assign({
    type: 'Update',
    showSearch: true,
    showAddNew: true,
    showDelete: true,
    showEdit: true,
    paging: true,
  }, options)
  const load = (pageNo?: number, s?: string, f?: any) => {
    let url = `${apiPath}${(apiPath || '').indexOf('?') > -1 ? '&' : '?'}`
    if (options.paging == false) {
      url += `pageSize=2000&page=1`
    } else {
      url += `pageSize=${pagination.pageSize}&page=${pageNo || pagination.page}`
    }
    if (s != undefined)
      url += `&search=` + encodeURIComponent(s)
    else if (search)
      url += `&search=` + encodeURIComponent(search)
    if (f) {
      let valList = url.split('?')[1].split('&')
      let yeniUrl = url.split('?')[0] + '?' + valList.filter(e => {
        if (Object.keys(f).findIndex(key => key == e.split('=')[0]) < 0) {

          return e
        }
      }).join('&')
      yeniUrl += '&' + Object.keys(f).map(key => `${key}=${encodeURIComponent((f[key] || '').trim())}`).join('&')
      url = yeniUrl
    }
    setLoading(true)
    getList(url, token)
      .then(result => {
        setList(result.docs as any[])
        setPagination(result as PaginationType)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const deleteRecord = (id: any) => {
    let url = `${apiPath.split('?')[0]}/${id}`
    deleteItem(url, token)
      .then(result => {
        load(1, search)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
  }

  const classBgOdd = 'bg-slate-300 bg-opacity-10 hover:bg-blue-500 hover:bg-opacity-10'
  const classBgEven = 'hover:bg-blue-500 hover:bg-opacity-10'

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load(1, '', filter) }, [token])



  return (<div className='flex flex-col gap-0'>
    <div className='w-full flex flex-col lg:flex-row lg:justify-between lg:items-center mb-2'>
      <h1 className='text-2xl lg:text-3xl lg:ms-2 flex items-center gap-2'>
        {icon}
        {title}
        </h1>
      <div className='flex items-center gap-4'>
        {options.showSearch &&
          <div className="relative w-full">
            <div className='absolute left-1.5 top-1.5 text-xl'>🔍</div>
            <Input
              type='search'
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              placeholder={t('search...')}
              defaultValue={search}
              onChange={e => {
                setSearch(e.target.value)
                e.target.value == "" && load(1, "")
              }}
              onKeyDown={e => e.code == 'Enter' && load(1, search)}
            />
          </div>
        }
        {onFilterPanel &&
          <FilterPanel
            trigger={<div className='px-2 lg:me-2 py-1 rounded bg-orange-600 text-white hover:bg-orange-400 hover:text-white'>
              <FilterIcon />
            </div>}>
            {onFilterPanel(filter, (e) => {
              setFilter(e)
              token && load(1, search, e)
            })}
          </FilterPanel>
        }
      </div>
    </div>

    <hr />
    {!loading && <>
      <div className='w-full text-[70%] md:text-base lg:text-[110%]'>
        {onHeaderPaint &&
          <div className='w-full flex flex-row items-center border-b mb-1 p-1'>
            <div className='text-slate-500 w-full font-semibold text-sm'>{onHeaderPaint()}</div>
            {options.type == 'Update' && (options.showAddNew || options.showEdit || options.showDelete) &&
              <div className=" w-20 p-1">
                <div className='w-full flex justify-end lg:justify-center'>
                  {options.showAddNew &&
                    <div
                      onClick={() => router.push(`${pathName}/addnew?${searchParams.toString()}`)}
                      className={`w-8 cursor-pointer px-2 py-2 rounded-md bg-green-800 text-white hover:bg-green-500 hover:text-white`}>
                      <PlusSquareIcon size={'16px'} />
                    </div>

                  }
                  {!options.showAddNew && <>#</>}
                </div>
              </div>
            }
          </div>
        }
        <div >
          {list && list.map((e, index) => (
            <div key={(e._id || 'grid' + index)} className={`w-full flex flex-row items-center rounded my-1 p-1 text-sm ${index % 2 == 1 ? classBgOdd : classBgEven}`}>
              {onRowPaint && onRowPaint(e, index)}

              <div className="w-20">
                <div className='w-full flex gap-2'>
                  {options.type == 'Update' && options.showEdit && e._id && <>
                    <div
                      onClick={() => router.push(`${pathName}/${e._id}?${searchParams.toString()}`)}
                      className={`cursor-pointer px-2 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-500 hover:text-white`}>
                      <EditIcon size={'16px'} />
                    </div>
                  </>}

                  {options.type == 'Update' && options.showDelete && e._id &&
                    <ButtonConfirm
                      onOk={() => {
                        if (onDelete) {
                          onDelete(e)
                        } else if (e._id) {
                          deleteRecord(e._id)
                        }
                      }}
                      title={t('Do you want to delete the record?')}
                      description={<span className='text-lg'>{e.name || e.description || e.documentNumber || e.issueDate || e._id}</span>}

                    >
                      <div className='px-2 py-2 rounded-md bg-red-800 text-white hover:bg-red-500 hover:text-white'>
                        <Trash2Icon size={'16px'} />
                      </div>
                    </ButtonConfirm>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
        {options.paging &&
          <div className='w-full'>
            <Pagination pagination={pagination} onPageClick={(pageNo: number) => {
              setPagination({ ...pagination, page: pageNo })
              load(pageNo, '', filter)
            }} />
          </div>
        }
      </div>
    </>}
    {loading && <div className='flex w-full h-full justify-center items-center'>
      <Loading />
    </div>}
  </div>)
}

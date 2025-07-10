import { Organization } from "./Organization"

export interface Member {
  _id?: string
  organization?:Organization
  username?: string
  name?: string
  role?: string
  passive?: boolean
}

export function getRoleList(t:any){
  return [
    {_id:'user',name:t('User')},
    {_id:'purchase',name:t('Purchase')},
    {_id:'admin',name:t('Administrator')},
  ]
}
import { Address, BillingInfo } from "./Address"

export interface Organization {
  _id?:string
  name?: string 
  billingInfo?:BillingInfo
  address?:Address
  passive?:boolean
}
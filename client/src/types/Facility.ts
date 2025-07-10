import { Address } from "./Address"

export interface Store {
    _id?:string
    organization?: string
    name?: string
    shutdown?: Shutdown
    address?:Address
    passive?:boolean
}

export interface Shutdown {
    minPrice?:number
    currency?:string | undefined | 'TRY' | 'USD' | 'EUR' | 'GBP'
}
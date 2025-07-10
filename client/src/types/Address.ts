export interface Address {
  room?: string
  streetName?: string
  blockName?: string
  buildingName?: string
  buildingNumber?: string
  citySubdivisionName?: string
  cityName?: string
  postalZone?: string
  postbox?: string
  region?: string
  district?: string
  country: Country
}

export interface Country {
  identificationCode?: string
  name?: string
}

export interface BillingInfo {
  individual?: boolean
  companyName?: string
  firstName?: string
  lastName?: string
  taxOffice: string
  taxNumber: string
  idCardNo: string
  eInvoiceMember?: boolean
  eDespatchMember?: boolean
  postboxAlias?: string
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function moneyFormat(x?: number, decimal: number = 2) {
  if (!x) {
    x = 0
  }
  // let ondalik = 1
  // Array.from(Array(decimal).keys()).forEach(() => ondalik = ondalik * 10)
  // x = Math.round(ondalik * x) / ondalik
  // let kusurat = x - Math.floor(x)
  // let suffix = ''
  // if (kusurat == 0) {
  //   suffix = '.00'
  // } else if (kusurat > 0 && kusurat.toString().length == 2) {
  //   suffix = '0'
  // } else if (kusurat > 0 && kusurat.toString().length == 3) {
  //   suffix = '0'
  // } else if (kusurat > 0 && kusurat.toString().length == 4) {
  //   suffix = ''
  // } else {
  //   suffix == ''
  // }

  return x.toLocaleString("en-US", { minimumFractionDigits: decimal, maximumFractionDigits: decimal })
  // return x.toLocaleString("en-US") + (x - Math.floor(x) == 0 && decimal > 0 ? '.' + '0'.repeat(decimal - (x - Math.floor(x)).toString().length + 1) : '0'.repeat(decimal - (x - Math.floor(x)).toString().length + 1))
  // return x.toLocaleString() + (x - Math.floor(x) == 0 ? '.00' : '')


}


export function currSymbol(currency?: string) {
  switch (currency) {
    case 'TL':
    case 'TRY':
      return '₺'
    case 'USD':
      return '$'
    case 'EUR':
    case 'EURO':
      return '€'
    default:
      return currency
  }
}

export function yesterday() {
  var t = new Date(new Date().setDate(new Date().getDate() - 1))
  t.setMinutes(t.getTimezoneOffset() * -1)
  return t.toISOString().substring(0, 10)
}

export function today() {
  var t = new Date()
  t.setMinutes(t.getTimezoneOffset() * -1)
  return t.toISOString().substring(0, 10)
}
export function oneYearLater() {
  var t = new Date()
  t.setMinutes(t.getTimezoneOffset() * -1)
  t.setFullYear(t.getFullYear() + 1)
  return t.toISOString().substring(0, 10)
}


export function startOfMonth() {
  var t = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  t.setMinutes(t.getTimezoneOffset() * -1)
  return t.toISOString().substring(0, 10)
}

export function startOfWeek() {
  var t = new Date()
  var w = new Date(t.setDate(t.getDate() - t.getDay()))
  w.setMinutes(w.getTimezoneOffset() * -1)
  return w.toISOString().substring(0, 10)
}

export function startOfLastMonth() {
  var t = new Date()
  var w = new Date(t.getFullYear(), t.getMonth() - 1, 1)
  w.setMinutes(w.getTimezoneOffset() * -1)
  return w.toISOString().substring(0, 10)
}

export function endOfLastMonth() {
  var t = new Date()
  var w = new Date(t.getFullYear(), t.getMonth(), 0)
  w.setMinutes(w.getTimezoneOffset() * -1)
  return w.toISOString().substring(0, 10)
}

export function startOfThreeMonthsAgo() {
  var t = new Date()
  var w = new Date(t.getFullYear(), t.getMonth() - 3, 1)
  w.setMinutes(w.getTimezoneOffset() * -1)
  return w.toISOString().substring(0, 10)
}

export function setLocalStorage(mainKey: string, key: string, val: any) {
  if (typeof window != 'undefined') {
    try {
      let obj = JSON.parse(localStorage.getItem(mainKey) || '{}') as any
      obj[key] = val
      localStorage.setItem(mainKey, JSON.stringify(obj))
    } catch { }
  }
}

export function getLocalStorage(mainKey: string, key: string) {
  if (typeof window != 'undefined') {
    try {
      let obj = JSON.parse(localStorage.getItem(mainKey) || '{}') as any
      return obj[key]
    } catch { }
    return
  }
}
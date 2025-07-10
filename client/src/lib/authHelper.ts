import { cookies } from 'next/headers'
import { v4 } from 'uuid'
import Cookies from 'js-cookie'
export function getAuthToken() {
  const token = cookies().get('token')?.value || ''
  return token
}

// export function getAuthUser() {
//   let user: UserType = {}
//   // if (typeof window == 'undefined') {
//   //   try {
//   //     user = JSON.parse(cookies().get('user')?.value || '{}') as UserType
//   //   } catch { }
//   // } else {
//   //   try {
//   //     user = JSON.parse(Cookies.get('user') || '{}') as UserType
//   //   } catch { }
//   // }
//   try {
//     user = JSON.parse(kurabi.get('user') || '{}') as UserType
//   } catch { }
//   return user
// }

// export function getDatabases() {
//   let dbList: DatabaseType[] = []
//   let dbId = ''
//   let db: DatabaseType | null = null
//   // if (typeof window == 'undefined') {
//   //   try {
//   //     dbList = JSON.parse(cookies().get('dbList')?.value || '[]') as DatabaseType[]
//   //   } catch { }
//   //   try {
//   //     db = JSON.parse(cookies().get('db')?.value || 'null') as DatabaseType | null
//   //   } catch { }
//   //   dbId = cookies().get('dbId')?.value || ''
//   // } else {
//   //   try {
//   //     dbList = JSON.parse(Cookies.get('dbList') || '[]') as DatabaseType[]
//   //   } catch { }
//   //   try {
//   //     db = JSON.parse(Cookies.get('db') || 'null') as DatabaseType | null
//   //   } catch { }
//   //   dbId = Cookies.get('dbId') || ''
//   // }
//   try {
//     dbList = JSON.parse(kurabi.get('dbList') || '[]') as DatabaseType[]
//   } catch { }
//   try {
//     db = JSON.parse(kurabi.get('db') || 'null') as DatabaseType | null
//   } catch { }
//   dbId = kurabi.get('dbId') || ''
//   return { dbId, db, dbList }
// }

const PERSIST_COOKIES = ['deviceId', 'theme', 'lang']
export function authSignOut() {
  cookies().delete('token')
  cookies().delete('user')
  cookies().getAll().forEach(c => {
    if (!PERSIST_COOKIES.includes(c.name)) {
      cookies().delete(c.name)
    }
  })
}

// export function authSignIn(magicToken: string) {
//   return new Promise<string>((resolve, reject) => {
//     postItem('/auth/magicLogin', { magicToken: magicToken })
//       .then(result => {

//         console.log('/auth/magicLink result:', result)
//         cookies().set('token', result.token, { secure: true })
//         cookies().set('user', JSON.stringify(result.user), { secure: true })
//         resolve('')
//       })
//       .catch(err => {
//         reject(err)
//       })

//   })

// }

// export function getDeviceId() {
//   if (typeof window == 'undefined') {
//     let deviceId: string = cookies().get('deviceId')?.value || ''
//     if (!deviceId) {
//       deviceId = v4()
//       cookies().set('deviceId', deviceId, { secure: true })
//     }
//     return deviceId
//   } else {
//     let deviceId: string = Cookies.get('deviceId') || ''
//     if (!deviceId) {
//       deviceId = v4()
//       Cookies.set('deviceId', deviceId, { secure: true })
//     }
//     return deviceId
//   }
// }
export function eventLog(obj: any, ...placeholders: any[]): void {
  let t = new Date()
  console.log(
    new Date().toISOString().replace(/T/g, ' ').split('.')[0],
    obj,
    ...placeholders,
  )
}

export function errorLog(obj: any, ...placeholders: any[]): void {
  let t = new Date()
  console.error(
    new Date().toISOString().replace(/T/g, ' ').split('.')[0],
    obj,
    ...placeholders,
  )
}

function welcomeMsg() {
  if (typeof window != 'undefined') {

    if (localStorage.getItem('_welcomeMsg') == new Date().toISOString().substring(0, 10)) return
    let msg = `%c 🍀AliAbi.org - We are shaping the future with the power of "Open Source"!🍀 \n 🍀💚🙏🏽🪬  You can see our source codes from https://github.com/aliabi-org  `
    let styles = [
      'font-size: 16px',
      'color: #fffce1',
      'font-family: monospace',
      'background: #0e100f',
      'display: inline-block',
      'padding: 1rem 3rem',
      'border: 1px solid #fffce1',
      'border-radius: 4px;',
    ].join(';')
    console.log(msg, styles)
    localStorage.setItem('_welcomeMsg', new Date().toISOString().substring(0, 10))
  }
}

export const consoleLogWelcomeMsg = () => welcomeMsg()

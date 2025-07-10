const __ar = require('./__ar.json')
const __az = require('./__az.json')
const __de = require('./__de.json')
const __en = require('./__en.json')
const __es = require('./__es.json')
const __fr = require('./__fr.json')
const __pl = require('./__pl.json')
const __ru = require('./__ru.json')
const __tr = require('./__tr.json')
const __zh = require('./__zh.json')

const LANG_LIST = {
  ar: __ar,
  az: __az,
  de: __de,
  en: __en,
  es: __es,
  fr: __fr,
  pl: __pl,
  ru: __ru,
  tr: __tr,
  zh: __zh,
}

exports.t = (key, lang = 'tr') => {
  lang = lang || 'tr'
  const langTable = LANG_LIST[lang] || __en

  if (!langTable[key]) {
    if (!langTable[key.toLowerCase()]) {
      return key
    } else {
      langTable[key.toLowerCase()]
    }
  } else {
    return langTable[key]
  }
}
// const axios = require('axios')

exports.sendSms = function (dest, msg) {
  return new Promise(async (resolve, reject) => {
    if (!process.env.SMS_API_URI)
      return resolve()

    const data = {
      api_id: process.env.SMS_API_ID,
      api_key: process.env.SMS_API_KEY,
      message_type: 'normal',
      message_content_type: 'bilgi',
      sender: process.env.SMS_SENDER,
      phones: [dest],
      message: msg
    }

    fetch(process.env.SMS_API_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),

    })
      .then(resp => {
        if (resp.ok) {
          resp
            .json()
            .then(result=>{
              if(result.status=='success'){
                resolve(result)
              }else{
                reject(result)
              }
            })
            .catch(reject)
        } else reject(resp.description)
      })
      .catch(reject)

  })
}
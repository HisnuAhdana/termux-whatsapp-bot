let {
  WAConnection
} = require('@adiwajshing/baileys')
let fs = require('fs')

//Function
async function startBot () {
  const MUT = new WAConnection()
  let attempts = 0
  MUT.on('qr', qr => {
    attempts += 1
    body: JSON.stringify({ type: 'qr', qr, attempts })
  })
  MUT.on('blocklist-update', () => {
    console.log('blocklist-update')
    const number = MUT.user.jid.split('@s.whatsapp.net')[0]
    fs.writeFileSync(`auth_info/${number}.json`, JSON.stringify(MUT.base64EncodedAuthInfo(), null, 2))
  })

  MUT.on('received-pong', () => {
    console.log('received-pong')
    MUT.close()
  })
  MUT.connect()
}

module.exports = newinstance

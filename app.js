const {
  WAConnection,
  MessageType,
  Presence,
  Mimetype,
  GroupSettingChange,
  MessageOptions
} = require('@adiwajshing/baileys')
const { getLevelingXp, getLevelingLevel, getLevelingId, addLevelingXp, addLevelingLevel, addLevelingId } = require('./lib/function/leveling')
const { color, bgcolor } = require('./lib/color')
const { simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom } = require('./lib/msgf')
const { start, info, success, close } = require('./lib/instance')
const { fetchJson } = require('./lib/fetcher')
const help = require('./lib/help')
const fs = require('fs')
const brainly = require('brainly-scraper')
const speed = require('performance-now')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const setting = JSON.parse(fs.readFileSync('./lib/setting.json'))
const apilink = JSON.parse(fs.readFileSync('./lib/apilink.json'))
const { eng, ind, arab } = require('./txt/lang/')
const txtlang = ind
const { getRegisteredRandomId, addRegisteredUser, createSerial, checkRegisteredUser } = require('./lib/function/verif')
const welcomejson = JSON.parse(fs.readFileSync('./src/welcome.json'))
const nsfwjson = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const simijson = JSON.parse(fs.readFileSync('./src/simi.json'))
const _leveling = JSON.parse(fs.readFileSync('./src/leveling.json'))
const _level = JSON.parse(fs.readFileSync('./src/level.json'))
const privategc_ = JSON.parse(fs.readFileSync('./src/privategc.json'))
const _scommand = JSON.parse(fs.readFileSync("./src/scommand.json"))
const packagejson = JSON.parse(fs.readFileSync('./package.json'))

groupminact = setting.groupminim
groupmemlimit = setting.grouplimit
pttmode = setting.pttmode
prefix = setting.prefix
blocked = []
banChats = false
roomttt = []
defttt = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"]

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return `${pad(hours)} ` + txtlang.hours() + ` ${pad(minutes)} ` + txtlang.minute() + ` ${pad(seconds)} ` + txtlang.second()
}

function addMetadata(packname, author) {
  if (!packname) packname = 'WABot'; if (!author) author = 'Bot';
  author = author.replace(/[^a-zA-Z0-9]/g, '');
  let name = `${author}_${packname}`
  if (fs.existsSync(`./src/stickers/${name}.exif`)) return `./src/stickers/${name}.exif`
  const json = {
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
  }
  const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])
  const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]

  let len = JSON.stringify(json).length
  let last

  if (len > 256) {
    len = len - 256
    bytes.unshift(0x01)
  } else {
    bytes.unshift(0x00)
  }

  if (len < 16) {
    last = len.toString(16)
    last = "0" + len
  } else {
    last = len.toString(16)
  }

  const buf2 = Buffer.from(last, "hex")
  const buf3 = Buffer.from(bytes)
  const buf4 = Buffer.from(JSON.stringify(json))

  const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])

  fs.writeFile(`./src/stickers/${name}.exif`, buffer, (err) => {
    return `./src/stickers/${name}.exif`
  })
}

async function startsBaileysBot() {
  const MUT = new WAConnection()
  MUT.logger.level = 'warn'
  MUT.on('qr', () => {
    console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
  })
  fs.existsSync('./auth_info/auth.json') && MUT.loadAuthInfo('./auth_info/auth.json')
  MUT.on('connecting', () => {
    start('2', 'Connecting...')
  })
  MUT.on('open', () => {
    success('2', 'Connected')
  })
  await MUT.connect({timeoutMs: 30*1000})
  fs.writeFileSync('./auth_info/auth.json', JSON.stringify(MUT.base64EncodedAuthInfo(), null, '\t'))
  MUT.on('group-participants-update', async (anu) => {
    if (welcomejson.includes(anu.jid)) {
      try {
        mdata = await MUT.groupMetadata(anu.jid)
        console.log(anu)
        if (anu.action == 'add') {
	  num = anu.participants[0]
	  try {
	    try {
	      ppimg = await MUT.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
	    } catch {
	      ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	    }
	    numss = MUT.contacts[num] != undefined ? MUT.contacts[num].vname || MUT.contacts[num].notify : undefined
	    membercount = num.length
	    welkomimg = apilink.hadi + 'card/Welcome?nama=' + numss + '&descriminator=' + membercount + '&memcount=' + membercount + '&gcname=' + mdata.subject + '&pp=' + ppimg + '&bg=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV_i4tqiKEL9D3gKHSSD8hZJICCERQocdOnA&usqp=CAU/'
	    let buff = await getBuffer(welkomimg)
	    MUT.sendMessage(mdata.id, buff, MessageType.image)
	  } catch {
	    try {
	      ppimg = await MUT.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
	    } catch {
	      ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	    }
	    teks = txtlang.hello() + ` @${num.split('@')[0]}\n` + txtlang.welcome() + ` *${mdata.subject}*`
	    let buff = await getBuffer(ppimg)
	    MUT.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
	  }
        } else if (anu.action == 'remove') {
	  num = anu.participants[0]
	  try {
	    try {
	      ppimg = await MUT.getProfilePicture(`${num.split('@')[0]}@c.us`)
	    } catch {
	      ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	    }
	    numss = MUT.contacts[num] != undefined ? MUT.contacts[num].vname || MUT.contacts[num].notify : undefined
	    membercount = num.length
	    gbye = apilink.hadi + 'card/goodbye?nama=' + numss + '&descriminator=' + membercount + '&memcount=' + membercount + '&gcname=' + mdata.subject + '&pp=' + ppimg + '&bg=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS68J17khEMFfAuvFefirk-vVs6lSf2RMAeFw&usqp=CAU'
	    let buff = await getBuffer(gbye)
	    MUT.sendMessage(mdata.id, buff, MessageType.image)
	  } catch {
	    try {
	      ppimg = await MUT.getProfilePicture(`${num.split('@')[0]}@c.us`)
	    } catch {
	      ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
	    }
	    teks = txtlang.goodbye() + ` @${num.split('@')[0]}👋`
	    let buff = await getBuffer(ppimg)
	    MUT.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
	  }
        }
      } catch (e) {
        console.log('Error : ', e)
      }
    }
  })
  MUT.on('CB:Blocklist', json => {
    if (blocked.length > 2) return
    for (let i of json[1].blocklist) {
      blocked.push(i.replace('c.us','s.whatsapp.net'))
    }
  })
  MUT.on('chat-update', async (mek) => {
    try {
      if (!mek.hasNewMessage) return
      mek = mek.messages.all()[0]
      if (!mek.message) return
      if (mek.key && mek.key.remoteJid == 'status@broadcast') return
      if (mek.key.fromMe) return
      global.prefix
      global.blocked
      const content = JSON.stringify(mek.message)
      const from = mek.key.remoteJid
      const type = Object.keys(mek.message)[0]
      const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
      const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
      const jam = moment().tz("Asia/Jakarta").format("HH:mm:ss");
      const wita = moment.tz("Asia/Makassar").format("HH:mm:ss");
      const wit = moment.tz("Asia/Jayapura").format("HH:mm:ss");
      const getCmd = (id) => {
        let position = null;
        Object.keys(_scommand).forEach((i) => {
          if (_scommand[i].id === id) {
            position = i;
          }
        });
        if (position !== null) {
          return _scommand[position].chats;
        }
      };
      let body = type === "conversation" && mek.message.conversation
        ? mek.message.conversation
        : type == "imageMessage" && mek.message.imageMessage.caption
        ? mek.message.imageMessage.caption
        : type == "videoMessage" && mek.message.videoMessage.caption
        ? mek.message.videoMessage.caption
        : type == "extendedTextMessage" && mek.message.extendedTextMessage.text
        ? mek.message.extendedTextMessage.text
        : type == "buttonsResponseMessage" && mek.message[type].selectedButtonId
        ? mek.message[type].selectedButtonId
        : type == "stickerMessage" &&
          getCmd(mek.message[type].fileSha256.toString("base64")) !== null &&
          getCmd(mek.message[type].fileSha256.toString("base64")) !== undefined
        ? getCmd(mek.message[type].fileSha256.toString("base64"))
        : "";
        for(AOW of prefix){
          if(body.startsWith(AOW)){prefix = AOW}else{}
        }
      let budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
      const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
      const args = body.trim().split(/ +/).slice(1)
      const isCmd = body.startsWith(prefix)
      const botNumber = MUT.user.jid
      const ownerNumber = [setting.ownernum + '@s.whatsapp.net'] // replace this with your number
      const isGroup = from.endsWith('@g.us')
      const sender = isGroup ? mek.participant : mek.key.remoteJid
      const groupMetadata = isGroup ? await MUT.groupMetadata(from) : ''
      const groupName = isGroup ? groupMetadata.subject : ''
      const groupId = isGroup ? groupMetadata.jid : ''
      const groupMembers = isGroup ? groupMetadata.participants : ''
      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
      const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
      const isGroupAdmins = groupAdmins.includes(sender) || false
      const isWelcome = isGroup ? welcomejson.includes(from) : false
      const isNsfw = isGroup ? nsfwjson.includes(from) : false
      const isSimi = isGroup ? simijson.includes(from) : false
      const isOwner = ownerNumber.includes(sender)
      const isRegister = checkRegisteredUser(sender)
      const isPrivateGc = isGroup ? privategc_.includes(from) : false
      const isLevelingOn = isGroup ? _leveling.includes(from) : false

      let authorname = MUT.contacts[from] != undefined ? MUT.contacts[from].vname || MUT.contacts[from].notify : undefined
      if (authorname != undefined) { } else { authorname = groupName }
      pushname = MUT.contacts[sender] != undefined ? MUT.contacts[sender].vname || MUT.contacts[sender].notify : undefined

      const isUrl = (url) => {
        return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
      }
      const reply = (teks) => {
	MUT.sendMessage(from, teks, text, {quoted:mek})
      }
      const sendMess = (hehe, teks) => {
	MUT.sendMessage(hehe, teks, text)
      }
      const mentions = (teks, memberr, id) => {
	(id == null || id == undefined || id == false) ? MUT.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : MUT.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
      }
      const sendButMessage = (from, text1, desc1, but = [], options = {}) => {
        const buttonMessage = {
          contentText: text1,
          footerText: desc1,
          buttons: but,
          headerType: 1,
        };
        MUT.sendMessage(
          from,
          buttonMessage,
          MessageType.buttonsMessage,
          options
        );
      };
      const registuser = () => {
        sendButMessage(from, setting.botname, txtlang.notverify(), [
          {
            buttonId: `${prefix}verify`,
            buttonText: {
              displayText: ind.verifynowbut(),
            },
          type: 1,
          },
        ], {quoted:mek})
      }
      idttt = [];
      players1 = [];
      players2 = [];
      turn = [];
      for (let i of roomttt) {
        idttt.push(i.id)
        players1.push(i.player1)
        players2.push(i.player2)
        turn.push(i.turn)
      }
      const isTTT = isGroup ? idttt.includes(from) : false
      const isPlayer1 = isGroup ? players1.includes(sender) : false
      const isPlayer2 = isGroup ? players2.includes(sender) : false
      let d = new Date();
      let locale = "id";
      let gmt = new Date(0).getTime() - new Date("1 January 1970").getTime();
      let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][
        Math.floor((d * 1 + gmt) / 84600000) % 5
      ];
      let week = d.toLocaleDateString(locale, { weekday: "long" });
      let date = d.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      let waktu = d.toLocaleDateString(locale, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
      if (time2 < "24:59:00") {
        var ucapanWaktu = txtlang.goodnight();
      }
      if (time2 < "18:00:00") {
        var ucapanWaktu = txtlang.goodafternoon();
      }
      if (time2 < "15:00:00") {
        var ucapanWaktu = txtlang.goodafternun();
      }
      if (time2 < "11:00:00") {
        var ucapanWaktu = txtlang.goodmorning();
      }
      if (time2 < "05:00:00") {
        var ucapanWaktu = txtlang.goodnight();
      }
      const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
        + 'VERSION:3.0\n' 
        + `FN:${setting.ownername}\n` // full name
        + 'ORG:Owner Bot;\n' // the organization of the contact
        + 'TEL;type=CELL;type=VOICE;waid=' + setting.ownernum + ':+' + setting.ownernum + '\n'
        + 'END:VCARD'
      if (isGroup && isLevelingOn) {
        const currentLevel = getLevelingLevel(sender)
        const checkId = getLevelingId(sender)
        try {
          if (currentLevel === undefined && checkId === undefined) addLevelingId(sender)
          const amountXp = Math.floor(Math.random() * 10) + 500
          const requiredXp = 5000 * (Math.pow(2, currentLevel) - 1)
          const getLevel = getLevelingLevel(sender)
          addLevelingXp(sender, amountXp)
          if (requiredXp <= getLevelingXp(sender)) {
            addLevelingLevel(sender, 1)
            await reply(txtlang.levelup(sender, getLevelingXp, getLevel, getLevelingLevel))
          }
        } catch (err) {
          console.error(err)
        }
      }
      if (isGroup) {
        if (groupminact === 'true') {
          const getmemberlength = groupMembers.length
          if (getmemberlength <= groupmemlimit) {
	        reply(`maaf member group belum memenuhi syarat. minimal member group adalah ${memberlimit}`)
	        setTimeout( () => {
 	         MUT.groupLeave(from) 
 	       }, 5000)
          }
        }
      }
      const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = MUT.user.phone
      colors = ['red','white','black','blue','yellow','green']
      const isMedia = (type === 'imageMessage' || type === 'videoMessage')
      const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
      const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
      const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
      if (!isGroup && isCmd) console.log('[MUT]', time, command, 'from', sender.split('@')[0], 'args :', args.length)
      if (!isGroup && !isCmd) console.log('[RECV]', time, 'Message', 'from', sender.split('@')[0], 'args :', args.length)
      if (isCmd && isGroup) console.log('[MUT]', time, command, 'from', sender.split('@')[0], 'in', groupName, 'args :', args.length)
      if (!isCmd && isGroup) console.log('[RECV]', time, 'Message', 'from', sender.split('@')[0], 'in', groupName, 'args :', args.length)
      if (!isOwner && banChats && isCmd === true) return
      switch(command) {
      case 'help':
        case 'menu':
          if (!isRegister) return registuser()
          //thumbmn = fs.readFileSync('./media/photo/mn.jpg')
          sendButMessage(from, setting.botname, help(prefix, packagejson), [
            {
              buttonId: `${prefix}info`,
              buttonText: {
                displayText: `Info`,
              },
              type: 1,
            },
            {
              buttonId: `${prefix}owner`,
              buttonText: {
                displayText: `Owner`,
              },
              type: 1,
            },
            {
              buttonId: `${prefix}author`,
              buttonText: {
                displayText: `Author`,
              },
              type: 1,
            },
          ], {quoted: ftroli});
        break
        case 'meme':
          if (!isRegister) return registuser()
          reply(txtlang.wait())
          try {
            memeilink = await fetchJson(apilink.mycodeit + `darkjokes`, { method: 'get'})
            memeimg = await getBuffer(memeilink.result)
            MUT.sendMessage(from, memeimg, image, { quoted:mek, caption:txtlang.done()})
          } catch(e) {
            reply('[ ! ] Error')
            console.log('Error : ' + e)
          }
        break
        case 'promote': 
          if (!isGroup) return reply(txtlang.onlygroup())
	  if (!isGroupAdmins) return reply(txtlang.onlyadmin())
	  if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
	  if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply(txtlang.tagcmd())
	  mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
	  if (mentioned.length > 1) {
	    txtacc = txtlang.acc()
	    for (let _ of mentioned) {
	      teks += `@${_.split('@')[0]}\n`
	    }
	    mentions(teks, mentioned, true)
	    MUT.groupMakeAdmin(from, mentioned)
	  } else {
	    mentions(`${txtlang.acc()}, ${txtlang.addedadmin()} : @${mentioned[0].split('@')[0]}`, mentioned, true)
	    MUT.groupMakeAdmin(from, mentioned)
	  }
	break
        case 'demote':
          if (!isGroup) return reply(txtlang.onlygroup())
	  if (!isGroupAdmins) return reply(txtlangonlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybdmin())
	  if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝐓𝐚𝐠 𝐭𝐚𝐫𝐠𝐞𝐭 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢 𝐭𝐮𝐫𝐮𝐧𝐤𝐚𝐧 𝐚𝐝𝐦𝐢𝐧')
	  mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
	  if (mentioned.length > 1) {
	    teks = ''
	    for (let _ of mentioned) {
	      teks += `${txtlang.acc()}, ${txtlang.demotedadmin()} :\n`
	      teks += `@_.split('@')[0]`
	    }
	    mentions(teks, mentioned, true)
	    MUT.groupDemoteAdmin(from, mentioned)
	  } else {
	    mentions(`${txtlang.acc()}, ${txtlang.demotedadmin()} @${mentioned[0].split('@')[0]}\n ${txtlang.ongroup()} _*${groupMetadata.subject}*_`, mentioned, true)
	    MUT.groupDemoteAdmin(from, mentioned)
	  }
	break
        case 'wa.me':
	case 'wame':
          if (!isRegister) return registuser()
          try {
            ppimg = await MUT.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
          } catch {
            ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
          }
          ppimgbuf = await getBuffer(ppimg)
          teks = `${txtlang.wame(sender)}`
          MUT.sendMessage(from, ppimgbuf, image, { quoted:mek, caption: teks, contextInfo: { mentionedJid: [sender] } } )
	break
        case 'blocklist':
          teks = 'This is list of blocked number :\n'
          for (let block of blocked) {
            teks += `~> @${block.split('@')[0]}\n`
          }
          teks += `Total : ${blocked.length}`
          MUT.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
        break
        case 'listadmins':
        case 'listadmin':
        case 'adminslist':
        case 'adminlist':
          if (!isGroup) return reply(txtlang.onlygroup())
          teks = `List admin group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
          no = 0
          for (let admon of groupAdmins) {
            no += 1
            teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
          }
          mentions(teks, groupAdmins, true)
        break
        case 'setprefix':
          if (args.length < 1) return
          if (!isOwner) return reply(txtlang.onlyowner())
          prefix = args[0]
          reply(txtlang.prefixchanged() + ` : ${prefix}`)
          console.log(color('[INFO]', 'green'), color(`${txtlang.prefixchanged()} : ${prefix}`, 'yellow'));
        break
        case 'setppbot':
          if (!isQuotedImage) return reply(`${txtlang.needimgcpt()} ${txtlang.or()} ${txtlang.needtagimgcpt()}`)
          if (!isOwner) return reply(txtlang.onlyowner())
          enmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
          media = await MUT.downloadAndSaveMediaMessage(enmedia)
          await MUT.updateProfilePicture(botNumber, media)
          reply(txtlang.done())
        break
        case 'bc':
          if (!isOwner) return reply(txtlang.onlyowner())
          if (args.length < 1) return reply('.......')
          anu = await MUT.chats.all()
          if (isMedia && !mek.message.videoMessage || isQuotedImage) {
            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            buff = await MUT.downloadMediaMessage(encmedia)
            for (let _ of anu) {
              MUT.sendMessage(_.jid, buff, image, {caption: `*[ BROADCAST ]*\n\n${body.slice(4)}`})
            }
            reply('')
          } else {
            for (let _ of anu) {
              sendMess(_.jid, `*[ BROADCAST ]*\n\n${body.slice(4)}`)
            }
            reply('Broadcast' + txtlang.done())
          }
        break
        case 'bcgc':
          if (!isOwner) return reply(txtlang.onlyowner())                              
          if (args.length < 1) return reply('.......')
          if (isMedia && !mek.message.videoMessage || isQuotedImage) {
            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            buff = await MUT.downloadMediaMessage(encmedia)
            for (let _ of groupMembers) {
              MUT.sendMessage(_.jid, buff, image, {caption: `*[ BC GROUP ]*\n*Group* : ${groupName}\n\n${body.slice(6)}`})
            }
            reply('')
          } else {
            for (let _ of groupMembers) {
              sendMess(_.jid, `*[ BC GROUP ]*\n*Group* : ${groupName}\n\n${body.slice(6)}`)
            }
            reply('Broadcast Group' + txtlang.done())
          }
        break
        case 'add':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          if (args.length < 1) return reply('.....')
          if (args[0].startsWith('08')) return reply(txtlang.countrynum())
          try {
            num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
            MUT.groupAdd(from, [num])
            reply(txtlang.done())
          } catch (e) {
            console.log('Error :', e)
            reply(txtlang.fail())
          }
        break
        case 'kick':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply(txtlang.needtagmember())
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
          if (mentioned.length > 1) {
            teks =  txtlang.acc() + txtlang.kicked() + ` :\n`
            for (let _ of mentioned) {
              teks += `@${_.split('@')[0]}\n`
            }
            mentions(teks, mentioned, true)
            MUT.groupRemove(from, mentioned)
          } else {
            mentions(`${txtlang.acc()} ${txtlang.kicked()} : @${mentioned[0].split('@')[0]}`, mentioned, true)
            MUT.groupRemove(from, mentioned)
            MUT.sendMessage(mentioned, txtlang.goodbye(), text)
          }
        break
        case 'linkgroup':
          if (isPrivateGc) return reply(txtlang.privategc())
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          linkgc = await MUT.groupInviteCode(from)
          reply('https://chat.whatsapp.com/'+linkgc)
        break
        case 'welcome':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (args.length < 1) return reply('.....')
          if (args[0] === 'enable') {
            if (isWelcome) return reply(txtlang.done())
            welcomejson.push(from)
            fs.writeFileSync('./src/welcome.json', JSON.stringify(welcomejson))
            reply(`${txtlang.succactwelcome()}✔️`)
          } else if (args[0] === 'disable') {
            welcomejson.splice(from, 1)
            fs.writeFileSync('./src/welcome.json', JSON.stringify(welcomejson))
            reply(`${txtlang.succnonactwelcome()} ✔️`)
          } else {
            reply(txtlang.enaordisa())
          }
        break
        case 'privategc':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (args.length < 1) return reply('.....')
          if (args[0] === 'enable') {
            if (isPrivateGc) return reply(txtlang.done())
            privategc_.push(from)
            fs.writeFileSync('./src/privategc.json', JSON.stringify(privategc_))
            reply(`${txtlang.succactprivategc()} ✔️`)
          } else if (args[0] === 'disable') {
            privategc_.splice(from, 1)
            fs.writeFileSync('./src/privategc.json', JSON.stringify(privategc_))
            reply(`${txtlang.succnonactprivategc()} ✔️`)
          } else {
            reply(txtlang.enaordisa())
          }
        break
        case 'leave':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          setTimeout( () => {
            MUT.groupLeave (from)
          }, 5000)
          setTimeout( () => {
            if (pttmode == 'true') {
              if (txtlang == ind) {
                indgoodbye = fs.readFileSync('./media/ptt/goodbyeind.mp3')
                MUT.sendMessage(from, indgoodbye, audio, { mimetype: 'audio/mp4', quoted:mek, ptt: true})
              } else {
                audgoodbye = fs.readFileSync('./media/ptt/goodbye.mp3')
                MUT.sendMessage(from, audgoodbye, audio, { mimetype: 'audio/mp4', quoted:mek, ptt: true})
              }
            } else if (pttmode = 'false') {
              MUT.sendMessage(from, txtlang.goodbye(), text)
            }
          }, 0)
        break
        case 'closegc':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          var nomor = mek.participant
          const close = {
            text: `${txtlang.gcclosed(nomor)}`,
            contextInfo: { mentionedJid: [nomor] }
          }
          MUT.groupSettingChange (from, GroupSettingChange.messageSend, true);
          reply(close)
        break
        case 'opengc':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          open = {
            text: `${txtlang.gcopened(sender)}`,
            contextInfo: { mentionedJid: [sender] }
          }
          MUT.groupSettingChange (from, GroupSettingChange.messageSend, false)
          MUT.sendMessage(from, open, text, {quoted: mek})
        break
        case 'setpttmode':
          if (args.length < 1) return reply('.....')
          if (!isOwner) return reply(txtlang.onlyowner())
          if (args[0] == 'true') {
            pttmode = 'true'
            reply(txtlang.pttmodechanged() + ` ${pttmode}`)
            console.log(color('[INFO]', 'green'), color(`${txtlang.pttmodechanged()} : ${pttmode}`, 'yellow'));
          } else if (args[0] == 'false') {
            pttmode = 'false'
            reply(txtlang.pttmodechanged() + ` ${pttmode}`)
            console.log(color('[INFO]', 'green'), color(`${txtlang.pttmodechanged()} : ${pttmode}`, 'yellow'));
          } else {
            reply(txtlang.wrongf())
          }
        break
        case 'stiker':
        case 'sticker':
          if (!isRegister) return registuser()
          if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            const media = await MUT.downloadAndSaveMediaMessage(encmedia)
            ran = getRandom('.webp')
            await ffmpeg(`./${media}`)
            .input(media)
            .on('start', function (cmd) {
              console.log(`Started : ${cmd}`)
            })
            .on('error', function (err) {
              console.log(`Error : ${err}`)
              fs.unlinkSync(media)
              reply(txtlang.fail())
            })
            .on('end', function () {
              console.log('Finish')
              exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ran} -o ${ran}`, async (error) => {
                if (error) return reply(txtlang.fail())
                MUT.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
                fs.unlinkSync(media)
                fs.unlinkSync(ran)
              })
            })
            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            .toFormat('webp')
            .save(ran)
          } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            const media = await MUT.downloadAndSaveMediaMessage(encmedia)
            ran = getRandom('.webp')
            reply(txtlang.wait())
            await ffmpeg(`./${media}`)
            .inputFormat(media.split('.')[1])
            .on('start', function (cmd) {
              console.log(`Started : ${cmd}`)
            })
            .on('error', function (err) {
              console.log(`Error : ${err}`)
              fs.unlinkSync(media)
              tipe = media.endsWith('.mp4') ? 'video' : 'gif'
              reply(txtlang.fail())
            })
            .on('end', function () {
              console.log('Finish')
              exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ran} -o ${ran}`, async (error) => {
                if (error) return reply(txtlang.fail())
                MUT.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
                fs.unlinkSync(media)
                fs.unlinkSync(ran)
              })
            })
            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            .toFormat('webp')
            .save(ran)
          } else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            const media = await MUT.downloadAndSaveMediaMessage(encmedia)
            ranw = getRandom('.webp')
            ranp = getRandom('.png')
            reply(txtlang.wait())
            keyrmbg = setting.removebgApiKey
            await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
              fs.unlinkSync(media)
              let buffer = Buffer.from(res.base64img, 'base64')
              fs.writeFileSync(ranp, buffer, (err) => {
                if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
              })
              exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
                fs.unlinkSync(ranp)
                if (err) return reply(txtlang.fail())
                exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ranw} -o ${ranw}`, async (error) => {
                  if (error) return reply(txtlang.fail())
                  MUT.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
                  fs.unlinkSync(ranw)
                })
              })
            })
          } else {
            reply(txtlang.needimgcpt() + ' ' + txtlang.or() + ' ' + txtlang.needtagimgcpt())
          }
        break
        case 'toimg':
          if (!isRegister) return registuser()
          if (!isQuotedSticker) return reply(txtlang.needtagstickcpt())
          reply(txtlang.wait())
          var encmedia_ = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
          var media_ = await MUT.downloadAndSaveMediaMessage(encmedia_)
          ran = getRandom('.png')
          exec(`ffmpeg -i ${media_} ${ran}`, (err) => {
            fs.unlinkSync(media_)
            if (err) return reply(txtlang.fail())
            buffer = fs.readFileSync(ran)
            MUT.sendMessage(from, buffer, image, {quoted: mek, caption: txtlang.done()})
            fs.unlinkSync(ran)
          })
        break
        case 'tomp3':
          if (!isRegister) return registuser()
          if (!isQuotedVideo) return reply(txtlang.needtagvidcpt())
          reply(txtlang.wait())
          encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
          media = await MUT.downloadAndSaveMediaMessage(encmedia)
          ran = getRandom('.mp4')
          exec(`ffmpeg -i ${media} ${ran}`, (err) => {
            fs.unlinkSync(media)
            if (err) return reply(txtlang.fail())
            buffer = fs.readFileSync(ran)
            MUT.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', quoted: mek})
            fs.unlinkSync(ran)
          })
        break
        case 'level':
          if (!isLevelingOn) return reply(txtlang.levelingon())
          if (!isGroup) return reply(txtlang.onlygroup())
          const userLevel = getLevelingLevel(sender)
          const userXp = getLevelingXp(sender)
          if (userLevel === undefined && userXp === undefined) return reply(txtlang.levelnol())
          sem = sender.replace('@s.whatsapp.net','')
          resul = txtlang.levelview(sem, userXp, userLevel, pushname)
          MUT.sendMessage(from, resul, text, { quoted: mek})
          .catch(async (err) => {
            console.error(err)
          })
          break
        case 'leveling':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (args.length < 1) return reply(txtlang.enaordisa())
          if (args[0] === 'enable') {
            if (isLevelingOn) return reply(txtlang.levelingalron())
            _leveling.push(from)
            fs.writeFileSync('./src/leveling.json', JSON.stringify(_leveling))
            reply(txtlang.levelon())
          } else if (args[0] === 'disable') {
            _leveling.splice(from, 1)
            fs.writeFileSync('./src/leveling.json', JSON.stringify(_leveling))
            reply(txtlang.leveloff())
          } else {
            reply(txtlang.enaordisa())
          }
        break
        case 'setppgc':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo: mek
          reply(txtlang.wait())
          const media = await MUT.downloadAndSaveMediaMessage(encmedia)
          await MUT.updateProfilePicture (from, media)
          reply(txtlang.done())
        break
        case 'delete':
        case 'del':
          if (!isGroup)return reply(txtlang.onlygroup())
          try {
            MUT.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
          } catch (e) {
            reply(txtlang.onlybotdel())
          }
        break
        case 'fitnah':
        case 'fake':
          if (!isRegister) return registuser()
          if (args.length < 1) return reply(txtlang.exafakecmd())
          var gh = body.slice(7)
          mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
          var replace = gh.split("|")[0];
          var target = gh.split("|")[1];
          var bot = gh.split("|")[2];
          MUT.sendMessage(from, `${bot}`, text, {
            quoted: {
              key: {
                fromMe: false, participant: `${mentioned}`, ...(from ? { remoteJid: from }: {})
              }, message: {
                conversation: `${target}`
              }
            }
          })
        break
        case 'setname':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          let idgrup = `${from.split("@s.whatsapp.net")[0]}`;
          MUT.groupUpdateSubject(idgrup, `${body.slice(9)}`)
          reply(txtlang.namegcchanged())
        break
        case 'info':
          uptime = process.uptime()
          runbrowser = MUT.browserDescription[1]
          browserversion = MUT.browserDescription[2]
          runtimebot = kyun(uptime)
          oshp = device_manufacturer
          osversion = os_version
          devicemodel = device_model
          speedbot = process.uptime()                                                                   
          ramdevice = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
          ramdevicetotal = Math.round(require('os').totalmem / 1024 / 1024)
          waversion = MUT.user.phone.wa_version
          teks = txtlang.infobot(uptime, setting, runbrowser, mcc, mnc, browserversion, runtimebot, oshp, osversion, devicemodel, ramdevice, ramdevicetotal, waversion, speedbot)
          reply(teks)
        break
        case 'github':
          reply('GitHub : https://github.com/moo-d/baileys-wabot')
        break
        case 'author':
          moo_dnum = '628886060342@s.whatsapp.net'
          mrfzvxnum = '6282223014661@s.whatsapp.net'
          kysxcodenum = '62815260684977@s.whatsapp.net'
          hadinum = '628990911211@s.whatsapp.net'
          owner = fs.readFileSync('./.github/rm/20210821_110622.jpg')
          const been = {
            text: `Author:\n- @${moo_dnum.split("@")[0]}\n- @${mrfzvxnum.split("@")[0]}\n- @${kysxcodenum.split("@")[0]}\n- @${hadinum.split("@")[0]}`,
            contextInfo: {
              mentionedJid: [moo_dnum, mrfzvxnum, kysxcodenum, hadinum]
            }
          }
          MUT.sendMessage(from, been, text, { quoted: { key: { fromMe: false, participant: "0@s.whatsapp.net", ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: {"imageMessage": {"caption": "\nIG : Moo-d\nWhatsapp BOT : BAILEYS-WABOT","jpegThumbnail": owner } } } } )
        break
        case 'owner':
          MUT.sendMessage(from, { displayname: "Jeff", vcard: vcard }, MessageType.contact, { quoted: mek })
        break
        case 'verify':
        case 'daftar':
        case 'register':
          if (isRegister) return reply(txtlang.hasverifyed())
          const namaUser = `${pushname}`
          const umurUser = `${sender}`
          const serialUser = createSerial(20)
          veri = sender
          if (isGroup) {
            addRegisteredUser(sender, namaUser, umurUser, time, serialUser)
            hasil = txtlang.verify(serialUser, namaUser, sender)
            sendButMessage(from, setting.botname, hasil, [
              {
                buttonId: `${prefix}help`,
                buttonText: {
                  displayText: `Menu`,
                },
                type: 1,
              },
            ], {quoted: mek});
            console.log(color('[REGISTER]'), color(time, 'yellow'), 'Name:', color(namaUser, 'cyan'), 'Age:', color(umurUser, 'cyan'), 'Serial:', color(serialUser, 'cyan'), 'in', color(sender || groupName))
          } else {
            addRegisteredUser(sender, namaUser, umurUser, time, serialUser)
            hasil = txtlang.verify(serialUser, namaUser, sender)
            sendButMessage(from, setting.botname, hasil, [
              {
                buttonId: `${prefix}help`,
                buttonText: {
                  displayText: `Menu`,
                },
                type: 1,
              },
            ], {quoted: mek});
            console.log(color('[REGISTER]'), color(time, 'yellow'), 'Name:', color(namaUser, 'cyan'), 'Age:', color(umurUser, 'cyan'), 'Serial:', color(serialUser, 'cyan'))
          }
        break
        case 'setdesc':
          if (!isGroup) return reply(txtlang.onlygroup())
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (!isBotGroupAdmins) return reply(txtlang.onlybadmin())
          MUT.groupUpdateDescription(from, `${body.slice(9)}`)
          MUT.sendMessage(from, txtlang.done(), text, { quoted: mek })
        break
        case 'randomanime':
        case 'anime':
          if (!isRegister) return registuser()
          if (isGroup) {
            if (!isNsfw) return reply(txtlang.nsfwnoton())
            var animsw = await getBuffer(apilink.mycodeit + 'anime')
            MUT.sendMessage(from, animsw, image, {quoted: mek, caption: 'halal'})
          } else {
            var animsw = await getBuffer(apilink.mycodeit + 'anime')
            MUT.sendMessage(from, animsw, image, {quoted: mek, caption: 'halal'})
          }
          break
        case 'corohelp':
          if (!isRegister) return registuser()
          if (args.length < 1) return reply(txtlang.parcountry())
          corocountry = args.join("")
          corolink = apilink.mycodeit + 'corohelp?country=' + corocountry
          cororslt = await fetchJson(corolink, {method: 'get'})                                                                                                                                                                    
          teks = `• Confirmed : ${cororslt.result.terkonfirmasi}\n• Death : ${cororslt.result.meniggal}\n• Healed : ${cororslt.result.sembuh}`
          reply(teks)
        break
        case 'nsfw':
          if (!isGroupAdmins) return reply(txtlang.onlyadmin())
          if (args.length < 1) return reply(txtlang.enaordisa())
          if (args[0] == 'enable') {
            if (isNsfw) return reply(txtlang.nsfwalron())
            nsfwjson.push(from)
            fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfwjson))
            reply(txtlang.nsfwon())
          } else if (args[0] == 'disable') {
            nsfwjson.splice(from)
            fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfwjson))
            reply(txtlang.nsfwoff())
          } else {
            reply(txtlang.enaordisa())
          }
        break
        case "setcmd":
          if(!isOwner) return (txtlang.onlyowner())
          if (args[0] == 'false') {
            banChats = false;
            reply(txtlang.setpublic());
          } else if (args[0] == 'true') {
            banChats = true;
            reply(txtlang.setprivate());
          }
        break
        case "brainly":
          if(!isRegister) return registuser()
          if (args.length < 1) return reply(txtlang.needquest());
          brien = args.join(" ");
          brainly(`${brien}`).then((res) => {
            teks = ""
            for (let Y of res.data) {
              br_quest = Y.pertanyaan
              br_answer = Y.jawaban[0].text
              teks += txtlang.brainlyview(br_quest, br_answer)
            }
            MUT.sendMessage(from, teks, text, {
              quoted: mek,
              detectLinks: false,
            });
          });
        break
        case 'ttt':
        case 'tictactoe':
          if (!isGroup) return reply("mainkan di group")
          if (args.length < 1) return reply ("tag orang yang mau kamu aja main")
          if (isTTT) return reply("permainan sedang berlangsung di group ini")
          if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag salah satu orang untuk di ajak bermain')
          ment = mek.message.extendedTextMessage.contextInfo.mentionedJid;
          player1 = sender
          player2 = ment[0]
          number = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"]
          id = from
          turn = player2
          roomttt.push({player1,player2,id,number,turn})
          MUT.sendMessage(from, `@${player1.split("@")[0]} Telah Memulai Game\n\n*@${player2.split("@")[0]}* anda di tantang untuk bermain game tic tac toe oleh *@${player1.split("@")[0]}*\nketik Y/N untuk menerima/menolak tantangan\n\nketik ${prefix}delttt untuk membatalkan permainan di group ini`, text, {contextInfo: {mentionedJid: player2}})
        break
	default:
	  if (isTTT && isPlayer2) {
            if (budy.startsWith("Y")){
              tto = roomttt.filter(gang => gang.id.includes(from))
              tty = tto[0]
              number = tto[0].number;
              teksboard = `*[ TIC TAC TOE GAME ]*
Player1 @${tty.player1.split('@')[0]}=❌
Player2 @${tty.player2.split('@')[0]}=⭕
${number[1]}${number[2]}${number[3]}
${number[4]}${number[5]}${number[6]}
${number[7]}${number[8]}${number[9]}
giliran = @${tty.player1.split('@')[0]}`
              MUT.sendMessage(from, teksboard, text, {quoted: mek, contextInfo:{mentionedJid: [tty.player1,tty.player2]}})
            }
            if (budy.startsWith('N')) {
              tto = roomttt.filter(gang => gang.id.includes(from))
              tty = tto[0]
              rooms = roomttt.filter(tokek => !tokek.id.includes(from))
              roomttt = rooms;
              MUT.sendMessage(from, `Yahh @${tty.player2.split('@')[0]} Menolak:(`,text,{quoted:mek,contextInfo:{mentionedJid:[tty.player2]}})
            }
          }
          if (isTTT && isPlayer1) {
            noober = parseInt(budy)
            if (isNaN(noober)) return 
            if (noober < 1 || noober > 9) return reply("masukan number dengan benar")
            main = roomttt.filter(gang => gang.id.includes(from))
            if (!defttt.includes(main[0].number[noober])) return reply("number sudah di isi, pilih number lain nya")
            if (main[0].turn.includes(sender)) return reply("tunggu giliran mu dulu ya")
            s = '❎'
            main[0].number[noober] = s
            main[0].turn = main[0].player1
            rooms = roomttt.filter(bang => !bang.id.includes(from))
            roomttt = rooms;
            pop = main[0]
            roomttt.push(pop)
            tto = roomttt.filter(hgh => hgh.id.includes(from))
            tty = tto[0]
            number = tto[0].number;
            ttt = `${number[1]}${number[2]}${number[3]}\n${number[4]}${number[5]}${number[6]}\n${number[7]}${number[8]}${number[9]}`
            winningspeech = () => {
              ucapan1 = `*[ Hasil pertandingan Tic Tac Toe ]*\n\nyeyyy permainan di menangkan oleh *@${tty.player1.split('@')[0]}*\n`
              ucapan2 = `*[ Papan Hasil akhir ]*\n\n${ttt}`
              MUT.sendMessage(from, ucapan1, text, {quoted:mek, contextInfo:{mentionedJid: [tty.player2]}}) 
              rooms = roomttt.filter(hhg => !hhg.id.includes(from))
              return roomttt = rooms 
            }
            if (number[1] == s && number[2] == s && number[3] == s) return winningspeech()
            if (number[1] == s && number[4] == s && number[7] == s) return winningspeech()
            if (number[1] == s && number[5] == s && number[9] == s) return winningspeech()
            if (number[2] == s && number[5] == s && number[8] == s) return winningspeech()
            if (number[4] == s && number[5] == s && number[6] == s) return winningspeech()
            if (number[7] == s && number[8] == s && number[9] == s) return winningspeech()
            if (number[3] == s && number[5] == s && number[7] == s) return winningspeech()
            if (number[3] == s && number[6] == s && number[9] == s) return winningspeech()
            if (!ttt.includes('1️⃣') && !ttt.includes('2️⃣') && !ttt.includes('3️⃣') && ! ttt.includes('4️⃣') && !ttt.includes('5️⃣') && !ttt.includes('6️⃣') && !ttt.includes('7️⃣') && !ttt.includes('8️⃣') && !ttt.includes('9️⃣')){
              ucapan1 = `*[ Hasil pertandingan Tic Tac Toe ]*\n\npermainan seri Good Game\n`
              ucapan2 = `*[ Papan Hasil akhir ]*\n\n${ttt}`
              reply(ucapan1)
              naa = roomttt.filter(hhg => !hhg.id.includes(from))
              return roomttt= naa
            }
            ucapan = `*[ TIC TAC TOE GAME ]*\n\nPlayer1 @${tty.player1.split('@')[0]}=❌\nPlayer2 @${tty.player2.split('@')[0]}=⭕\n\n${ttt}\n\ngiliran = @${tty.player2.split('@')[0]}`
            MUT.sendMessage(from, ucapan, text, {quoted: mek, contextInfo:{mentionedJid: [tty.player1,tty.player2]}})
          }
          if (isTTT && isPlayer2) {
            noober = parseInt(budy)
            if (isNaN(noober)) return
            if (noober < 1 || noober > 9) return reply("masukan number dengan benar")
            main = roomttt.filter(gang => gang.id.includes(from))
            if (!defttt.includes(main[0].number[noober])) return reply("number sudah di isi, pilih number lain nya")
            if (main[0].turn.includes(sender)) return reply("tunggu giliran mu dulu ya")
            s = '🅾️'
            main[0].number[noober] = s
            main[0].turn = main[0].player2
            rooms = roomttt.filter(bang => !bang.id.includes(from))
            roomttt = rooms;
            pop = main[0]
            roomttt.push(pop)
            tto = roomttt.filter(hgh => hgh.id.includes(from))
            tty = tto[0]
            number = tto[0].number;
            ttt = `${number[1]}${number[2]}${number[3]}\n${number[4]}${number[5]}${number[6]}\n${number[7]}${number[8]}${number[9]}`
            winningspeech = () => {
              ucapan1 = `*[ Hasil pertandingan Tic Tac Toe ]*\n\nyeyyy permainan di menangkan oleh *@${tty.player2.split('@')[0]}*\n`
              ucapan2 = `*[ Papan Hasil akhir ]*\n\n${ttt}`
              MUT.sendMessage(from, ucapan1, text, {quoted:mek, contextInfo:{mentionedJid: [tty.player1]}}) 
              rooms = roomttt.filter(hhg => !hhg.id.includes(from))
              return roomttt = rooms 
            }
            if (number[1] == s && number[2] == s && number[3] == s) return winningspeech()
            if (number[1] == s && number[4] == s && number[7] == s) return winningspeech()
            if (number[1] == s && number[5] == s && number[9] == s) return winningspeech()
            if (number[2] == s && number[5] == s && number[8] == s) return winningspeech()
            if (number[4] == s && number[5] == s && number[6] == s) return winningspeech()
            if (number[7] == s && number[8] == s && number[9] == s) return winningspeech()
            if (number[3] == s && number[5] == s && number[7] == s) return winningspeech()
            if (number[3] == s && number[6] == s && number[9] == s) return winningspeech()
            if (!ttt.includes('1️⃣') && !ttt.includes('2️⃣') && !ttt.includes('3️⃣') && ! ttt.includes('4️⃣') && !ttt.includes('5️⃣') && !ttt.includes('6️⃣') && !ttt.includes('7️⃣') && !ttt.includes('8️⃣') && !ttt.includes('9️⃣')){
              ucapan1 = `*[ Hasil pertandingan Tic Tac Toe ]*\n\npermainan seri Good Game\n`
              ucapan2 = `*[ Papan Hasil akhir ]*\n\n${ttt}`
              reply(ucapan1)
              naa = roomttt.filter(hhg => !hhg.id.includes(from))
              return roomttt= naa
            }
            ucapan = `*[ TIC TAC TOE GAME ]*\n\nPlayer1 @${tty.player1.split('@')[0]}=❌\nPlayer2 @${tty.player2.split('@')[0]}=⭕\n\n${ttt}\n\ngiliran = @${tty.player1.split('@')[0]}`
            MUT.sendMessage(from, ucapan, text, {quoted: mek, contextInfo:{mentionedJid: [tty.player1,tty.player2]}})
          }
        if (isGroup && isSimi && budy != undefined) {
	  console.log(budy)
	  muehe = await simih(budy)
          console.log(muehe)
          reply(muehe)
        } else {
          console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
        }
      }
    } catch (e) {
      console.log('Error : %s', color(e, 'red'))
    }
  })
}
startsBaileysBot()

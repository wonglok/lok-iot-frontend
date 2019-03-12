import axios from 'axios'

export const getBase = () => {
  let base = window.location.protocol + `//` + window.location.hostname + `:5000`
  if (process.env.NODE_ENV === 'production') {
    base = 'https://lok-iot.herokuapp.com'
  }
  // override
  base = 'https://lok-iot.herokuapp.com'
  return base
}

export const getSavedCred = () => {
  let item = window.localStorage.getItem('cred-ls')
  if (item) {
    try {
      let cred = JSON.parse(item)
      return cred
    } catch (e) {
      console.log('err', e)
      window.localStorage.removeItem('cred-ls')
      return false
    }
  }
}

export const reqCred = async (auth) => {
  let base = getBase()
  let resp = await axios.post(base + '/controller-token', auth)
  let cred = resp.data
  window.localStorage.setItem('cred-ls', JSON.stringify(cred))
  return cred
}

export const logout = () => {
  ws = false
  window.localStorage.removeItem('cred-ls')
}

let ws = false
export const getWS = () => ws

export const initWS = async (cred) => {
  return new Promise((resolve, reject) => {
    let origin = encodeURIComponent(window.location.origin)
    let base = getBase().replace('https://', 'wss://')
    ws = new WebSocket(`${base}/?run=1&appID=${cred.appID}&appHash=${cred.appHash}&origin=${origin}`)
    ws.addEventListener('message', (v) => {
      if (!ws) {
        return
      }
      let data = JSON.parse(v.data)
      console.log(data)
      if (data.checkHeartBeat) {
        ws.send(JSON.stringify({
          referrer: window.location.origin,
          from: 'Web',
          ip: window.location.hostname,
          heartbeat: Math.random()
        }))
      }
    })
    ws.addEventListener('close', () => {
      setTimeout(() => {
        initWS(cred)
      }, 5000)
    })
    ws.addEventListener('open', () => {
      resolve(ws)
    })
  })
}

export const lit = (time) => {
  let ws = getWS()
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      referrer: window.location.origin,
      from: 'FrontEnd',
      room: 'IoT',
      lit: time || Math.random()
    }))
  }
}

export const runLedStrip = (ledStrip) => {
  let ws = getWS()
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      referrer: window.location.origin,
      from: 'FrontEnd',
      room: 'IoT',
      ledStrip: ledStrip
    }))
  }
}

export const goStreamLED = (streamLED) => {
  let ws = getWS()
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      // referrer: window.location.origin,
      // from: 'FrontEnd',
      room: 'IoT',
      streamLED: streamLED
    }))
  }
}

export const getClientStatus = async (cred) => {
  let base = getBase()
  let resp = await axios({
    method: 'post',
    url: base + '/client-status',
    headers: {
      'X-AppID': cred.appID,
      'X-AppHash': cred.appHash
    }
  })
  let status = resp.data

  return status
}

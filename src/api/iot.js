import axios from 'axios'

export const getBase = () => {
  let base = window.location.protocol + `//` + window.location.hostname + `:5000`
  if (process.env.NODE_ENV === 'production') {
    base = 'https://lok-iot.herokuapp.com'
  }
  // base = 'https://lok-iot.herokuapp.com'
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
    ws = new WebSocket(`wss://lok-iot.herokuapp.com/?run=1&appID=${cred.appID}&appHash=${cred.appHash}&origin=${window.location.origin}`)
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

export const lit = () => {
  let ws = getWS()
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      referrer: window.location.origin,
      from: 'FrontEnd',
      room: 'IoT',
      lit: Math.random()
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

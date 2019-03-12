<template>
  <div class="home">
    <h2>Lok's Internet of Things (iot)</h2>
    <Login @cred="onUpdateCredentials" v-if="!cred"></Login>
    <Logout @cred="onUpdateCredentials" v-if="cred"></Logout>

    <div v-if="iot.getWS()">
      <div>
        <button @click="lit">Remote Contorl ESP8266 IC from Web to Lit.</button>
        Light up how long<input type="text" v-model="time" />
      </div>
      <div>
        ledStrip.numLED
        <input type="text" v-model="ledStrip.numLED" placeholder="ledStrip.numLED" />
        <br />
        ledStrip.satuate
        <input type="range" min="0" step="0.000001" max="1.0" v-model="ledStrip.satuate" placeholder="ledStrip.satuate" />
        <input type="text" v-model="ledStrip.satuate" placeholder="ledStrip.satuate" />
        <br />

        ledStrip.light
        <input type="text" v-model="ledStrip.light" placeholder="ledStrip.light" />
        <input type="range" min="0" step="0.000001" max="1.0" v-model="ledStrip.light" placeholder="ledStrip.light" />
        <br />

        ledStrip.timeFactor
        <input type="range" min="0" step="0.000001" max="0.1" v-model="ledStrip.timeFactor" placeholder="ledStrip.satuate" />
        <input type="text" v-model="ledStrip.timeFactor" placeholder="ledStrip.timeFactor" />
        <br />

        <button @click="runLedStrip">Lit Strip</button>
      </div>

      <div>
        <Button @click="goStreamLED">StreamLED</Button>
      </div>
    </div>

    <button v-if="cred" @click="getClients">Get ClientStatus</button>
    <pre v-if="cred && status">{{status}}</pre>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'
import Logout from '@/components/Logout.vue'
import * as iot from '@/api/iot'

/* eslint-disable */
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
       Math.round(r * 255),
       Math.round(g * 255),
       Math.round(b * 255)
    ]
}
/* eslint-enable */

export default {
  name: 'home',
  components: {
    Login,
    Logout
  },
  data () {
    return {
      startTime: Date.now(),
      iot,
      ws: false,
      cred: false,
      status: false,
      time: 0.1,
      ledStrip: {
        numLED: 36,
        satuate: 1,
        light: 0.01,
        timeFactor: 0.005
      }
    }
  },
  watch: {
    async cred () {
      if (this.cred) {
        this.ws = await iot.initWS(this.cred)
      }
    }
  },
  methods: {
    async getClients () {
      let status = await iot.getClientStatus(this.cred)
      this.status = status
    },
    lit () {
      iot.lit(this.time)
    },
    runLedStrip () {
      iot.runLedStrip(this.ledStrip)
    },
    onUpdateCredentials (v) {
      this.cred = v
    },
    goStreamLED () {
      var n = 10 * 3
      var ni = n / 3

      var repeat = () => {
        let data = []
        let time = Date.now() - this.startTime
        for (var i = 0; i < n; i += 3) {
          var h = ((i + time * this.ledStrip.timeFactor) % ni) / ni
          var s = this.ledStrip.satuate
          var l = this.ledStrip.light
          let arr = HSVtoRGB(h, s, l, true)
          data[i + 0] = arr[0]
          data[i + 1] = arr[1]
          data[i + 2] = arr[2]
        }
        iot.goStreamLED(data)
      }

      clearInterval(this.timerInterval)
      this.timerInterval = setInterval(() => {
        repeat()
      }, 0)
    }
  }
}
</script>

<style scoped>
pre{
  text-align: left;
}
</style>

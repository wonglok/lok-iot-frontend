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
        <input type="text" v-model="ledStrip.numLED" placeholder="ledStrip.numLED" />
        <input type="text" v-model="ledStrip.satuate" placeholder="ledStrip.satuate" />
        <input type="text" v-model="ledStrip.light" placeholder="ledStrip.light" />
        <button @click="runLedStrip"></button>
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
export default {
  name: 'home',
  components: {
    Login,
    Logout
  },
  data () {
    return {
      iot,
      ws: false,
      cred: false,
      status: false,
      time: 0.1,
      ledStrip: {
        numLED: 30,
        satuate: 1,
        light: 0.5
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
    }
  }
}
</script>

<style scoped>
pre{
  text-align: left;
}
</style>

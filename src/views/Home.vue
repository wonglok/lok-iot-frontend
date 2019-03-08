<template>
  <div class="home">
    <h2>Lok's Internet of Things (iot)</h2>
    <Login @cred="onCred" v-if="!cred"></Login>
    <Logout @cred="onCred" v-if="cred"></Logout>
    <button v-if="iot.getWS()" @click="lit">Lit</button>

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
      status: false
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
      iot.lit()
    },
    onCred (v) {
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

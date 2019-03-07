<template>
  <div class="home">
    <Login @cred="onCred" v-if="!cred"></Login>
    <button v-if="iot.getWS()" @click="lit">Lit</button>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'
import * as iot from '@/api/iot'
export default {
  name: 'home',
  components: {
    Login
  },
  data () {
    return {
      iot,
      ws: false,
      cred: false
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
</style>

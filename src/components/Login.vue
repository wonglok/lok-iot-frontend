<template>
  <div>
    <input type="text" v-model="auth.username" @keydown.enter="reqCredential" />
    <input type="password" v-model="auth.password" @keydown.enter="reqCredential" />
    <button @click="reqCredential">Login</button>
  </div>
</template>

<script>
import * as iot from '@/api/iot'
export default {
  data () {
    return {
      auth: {
        username: '',
        password: ''
      }
    }
  },
  mounted () {
    let cred = iot.getSavedCred()
    if (cred) {
      this.$emit('cred', cred)
    }
  },
  methods: {
    async reqCredential () {
      let cred = await iot.reqCred(this.auth)
      this.$emit('cred', cred)
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <input type="text" v-model="auth.username" @keydown.enter="requestItem" />
    <input type="password" v-model="auth.password" @keydown.enter="requestItem" />
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
    async requestItem () {
      let cred = await iot.reqCred(this.auth)
      this.$emit('cred', cred)
    }
  }
}
</script>

<style>

</style>

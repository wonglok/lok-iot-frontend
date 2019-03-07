<template>
  <div>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import * as iot from '@/api/iot'
export default {
  methods: {
    logout () {
      iot.logout()
      this.$emit('cred', false)
    }
  }
}
</script>

<style>

</style>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return{
      user: null,
    }
  },
  created() {
    // localStorage.setItem("url", 'http://127.0.0.1:8070/')
    // localStorage.setItem("url", 'http://47.96.70.129:8070/')
    localStorage.setItem("url", 'http://47.115.54.95:8070/')
  }
}
</script>

<style>
</style>

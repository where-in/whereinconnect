<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {};
</script>

<style>
body {
  font-family: Whitney, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica,
    Arial, sans-serif;
  font-size: 18px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.45);
  background-color: #fcfcfc;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
  height: 100%;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  box-shadow: 0 0 0 60px #fff inset;
  -webkit-text-fill-color: #000;
}
li {
    word-break: break-all;
    text-align: left;
}
</style>

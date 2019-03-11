<template>
  <el-container>
    <el-header class="header">
      <a id="logo" href="/"></a>
      <div>
        <v-avatar color="white" :size="38">
          <span class="black--text headline">J</span>
        </v-avatar>
      </div>
    </el-header>
    <el-main class="main">
      <router-view/>
    </el-main>
  </el-container>
</template>

<style>
  html, body {
    margin: 0;
    padding: 0;
  }
</style>
<style lang="scss">
  .header {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 66px;
    justify-content: space-between;
    background-color: rgba(0,0,0,.2);
    position: absolute;
    top: 0;
    left: 0;
  }
  .main {
    padding: 0;
  }
  #logo {
    display: inline-block;
    width: 120px;
    height: 35px;
    background: url(https://pixabay.com/static/img/sprites.svg?a), none;
    background-position: 0 -380px;
  }
</style>

<template>
  <Header v-if="userInfoStore.id" />
  <!-- el-row清除栅格默认边距 -->
  <el-row class="layout-row" gutter="0">
    <el-col :span="4" v-if="userInfoStore.id" class="sidebar-col">
      <Menu />
    </el-col>
    <el-col :span="userInfoStore.id ? 20 : 24" class="main-col">
      <router-view />
    </el-col>
  </el-row>
</template>


<script setup>
import Header from "./components/Header.vue";
import Menu from "./components/Menu.vue";
import { useUserInfoStore } from "./stores/userInfo.js";
const userInfoStore = useUserInfoStore();
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  width: 100%;
  height: 100%;
}
#app {
  width:100%;
  height: 100%;
}
.layout-row{
  height: calc(100% - 60px);
}
.sidebar-col{
  height: 100%;
}
.main-col {
  height:100%;
  /*彻底删掉el‑col自带的左右padding，根治右侧留白*/
  padding: 0 !important;
}
</style>
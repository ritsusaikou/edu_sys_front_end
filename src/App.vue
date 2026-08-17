<template>
  <Header v-if="userInfoStore.userInfo.id" :userInfo="userInfoStore.userInfo" />
  <el-row>
    <el-col v-bind:span="4">
      <Menu v-if="userInfoStore.userInfo.id" />
    </el-col>
    <el-col v-bind:span="20">
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
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

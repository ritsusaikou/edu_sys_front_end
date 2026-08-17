<template>
  Home 这里是教务系统主页，可以查看各种公开信息
  <div v-if="!userInfoStore.userInfo.id">
    如想要查看更多个性化信息请登录或注册
    <el-button type="primary" @click="toLogin">登录</el-button>
    <el-button @click="toRegister">注册</el-button>
  </div>
  若要查看更多关于此网站的信息，请点击下方关于
  <div>
    <el-button type="info" @click="toAbout">关于</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserInfoStore } from "../stores/userInfo";

const userInfoStore = useUserInfoStore();
const router = useRouter();

const toLogin = () => {
  router.push("/login");
};

const toRegister = () => {
  router.push("/register");
};

const toAbout = () => {
  router.push("/about");
};
</script>

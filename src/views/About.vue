<template>
  About 本网站是一个学习用网站，实现了教务系统的一些基础功能
  <div>
    <el-button @click="toHome">返回主页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const toHome = () => {
  router.push("/home");
};
</script>

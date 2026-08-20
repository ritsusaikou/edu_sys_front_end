<template>
  <el-menu router>
    <el-menu-item index="home">
      <span>主页</span>
    </el-menu-item>
    <el-menu-item index="class" v-if="userInfoStore.role === 3">
      <span>班级</span>
    </el-menu-item>
    <el-menu-item index="course" v-if="userInfoStore.role === 3">
      <span>课程</span>
    </el-menu-item>
        <el-menu-item index="evaluate-course-score" v-if="userInfoStore.role === 2">
      <span>评估学生课程成绩</span>
    </el-menu-item>
    <el-menu-item index="course-choice" v-if="userInfoStore.role === 1">
      <span>选课</span>
    </el-menu-item>
    <el-menu-item index="score-query" v-if="userInfoStore.role === 1">
      <span>查询选课成绩</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { useUserInfoStore } from "../stores/userInfo";

const userInfoStore = useUserInfoStore();
</script>

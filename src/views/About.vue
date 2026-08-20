<template>
  <div class="about-wrap">
    <div class="about-card">
      <div class="about-header">
        <h2 class="about-title">关于本系统</h2>
        <p class="about-desc">
          本教务管理系统为课程实践项目，实现选课管理、成绩查询、课程信息维护等核心基础业务功能，用于Web全栈开发技术学习与项目实践。
        </p>
      </div>

      <el-card shadow="hover" class="doc-card">
        <template #header>
          <span class="card-header-title">网站相关文档</span>
        </template>
        <div class="doc-content">
          此处可放置系统需求文档、接口文档、数据库设计说明、部署说明等项目资料。
        </div>
      </el-card>

      <div class="btn-wrap">
        <el-button type="primary" @click="toHome">返回主页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const toHome = () => {
  router.push("/home");
};
</script>

<style scoped>
.about-wrap {
  min-height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f5f7fa;
}
.about-card {
  width: 100%;
  max-width: 820px;
}
.about-header {
  margin-bottom: 32px;
  text-align: center;
}
.about-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px;
}
.about-desc {
  font-size: 16px;
  color: #606266;
  line-height: 1.75;
  margin:0;
}
.doc-card {
  margin-bottom: 32px;
}
.card-header-title{
  font-size:17px;
  font-weight:500;
  color:#303133;
}
.doc-content {
  min-height: 180px;
  padding:12px 8px;
  font-size: 15px;
  color:#606266;
  line-height:1.8;
}
.btn-wrap {
  text-align: center;
}
</style>
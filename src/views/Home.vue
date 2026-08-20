<template>
  <div class="home-wrap">
    <!-- 顶部导航栏：右上角登录注册 -->
    <header class="home-header">
      <div class="header-left">
        <h2 class="home-title">教务管理系统</h2>
      </div>
      <!-- 右上角：未登录才显示登录注册 -->
      <div class="header-right" v-if="!userInfoStore.id">
        <el-button type="primary" @click="toLogin">登录</el-button>
        <el-button @click="toRegister">注册</el-button>
      </div>
    </header>

    <div class="home-card">
      <p class="home-desc">这里是教务系统主页，可以查看各种公开信息</p>

      <!-- 首页主体布局 左：轮播图  右：公共通知 -->
      <el-row gutter="20" class="main-content">
        <!-- 左侧轮播图 -->
        <el-col :span="14">
          <el-carousel height="320px" indicator-position="outside">
            <el-carousel-item>
              <div class="banner-item banner-1">
                <span>欢迎使用教务管理系统</span>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="banner-item banner-2">
                <span>选课通知 · 新学期选课即将开启</span>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div class="banner-item banner-3">
                <span>成绩公告 · 期末成绩已陆续发布</span>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-col>

        <!-- 右侧公共信息卡片 -->
        <el-col :span="10">
          <el-card shadow="hover" class="info-card">
            <template #header>
              <div class="card-header">
                <span>---------->>>系统公开公告<<<----------</span>
              </div>
            </template>
            <div class="notice-list">
              <div class="notice-item">
                <span class="dot"></span>
                <span>2026‑2027学年第一学期校历已发布</span>
              </div>
              <div class="notice-item">
                <span class="dot"></span>
                <span>图书馆借阅延期办理通知</span>
              </div>
              <div class="notice-item">
                <span class="dot"></span>
                <span>校园卡充值系统维护公告</span>
              </div>
              <div class="notice-item">
                <span class="dot"></span>
                <span>奖学金申报时间安排通知</span>
              </div>
              <div class="notice-item">
                <span class="dot"></span>
                <span>选修课退补选截止提醒</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <p class="about-tip">若要查看更多关于此网站的信息，请点击下方关于</p>
      <div class="btn-wrap">
        <el-button type="info" @click="toAbout">关于</el-button>
      </div>
    </div>
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

<style scoped>
.home-wrap {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 0 30px 40px;
}

/* 顶部导航栏 */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
}
.header-left .home-title{
  margin: 0;
  font-size: 26px;
  color: #303133;
}
.header-right{
  display: flex;
  gap:12px;
}

.home-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  max-width: 1200px;
  margin: 0 auto;
}

.home-desc {
  font-size: 16px;
  color: #606266;
  margin-bottom: 24px;
}

/* 轮播图 */
.banner-item{
  width: 100%;
  height: 100%;
  display:flex;
  align-items:center;
  justify-content:center;
  color:white;
  font-size:20px;
  font-weight:500;
}
.banner-1{
  background: linear-gradient(135deg, #409eff, #66b1ff);
}
.banner-2{
  background: linear-gradient(135deg, #67c23a, #85ce61);
}
.banner-3{
  background: linear-gradient(135deg, #e6a23c, #ebb563);
}

/*右侧公告卡片*/
.info-card{
  height: 100%;
}
.card-header{
  font-weight: bold;
  font-size:17px;
}
.notice-list{
  display:flex;
  flex-direction:column;
  gap:16px;
}
.notice-item{
  display:flex;
  align-items:center;
  gap: 8px;
  color:#4e5969;
  cursor:pointer;
  transition: color 0.2s;
}
.notice-item:hover{
  color:#409eff;
}
.dot{
  width:6px;
  height:6px;
  background-color:#409eff;
  border-radius:50%;
  flex-shrink:0;
}

.about-tip {
  margin-top:30px;
  text-align:center;
  color:#747679;
}
.btn-wrap{
  text-align:center;
  margin-top:12px;
}
</style>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <h2 style="text-align: center; margin-bottom: 32px">登录</h2>

      <div style="display: flex; justify-content: center">
        <el-form-item label="账户：">
          <el-input
            v-model="account"
            style="width: 240px"
            placeholder="请输入电话或邮箱"
          />
        </el-form-item>
      </div>
      <div style="display: flex; justify-content: center">
        <el-form-item label="密码：">
          <el-input
            v-model="password"
            style="width: 240px"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="register">注册</el-button>
        <el-button type="info" @click="toHome">返回主页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import request from "../utils/request"; // Vue3正确路由写法，不用import整个路由文件
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserInfoStore } from "../stores/userInfo";

// 定义响应式变量
const account = ref("");
const password = ref("");

// 获取路由实例
const router = useRouter();

const userInfoStore = useUserInfoStore();

// 登录逻辑
const login = async () => {
  // 简单非空校验
  if (!account.value || !password.value) {
    ElMessage.error("账号密码不能为空");
    return;
  }

  const res = await request.post("/user/loginByAccount", {
    account: account.value,
    password: password.value,
  });
  // console.log(res);
  if (res.code === 200) {
    ElMessage.success("登录成功");
    const res = await request.get("/user/getInfo");
    if (res.code === 200) {
      userInfoStore.login(res.data);
    } else {
      ElMessage.error(res.msg);
    }
    router.push("/home");
  } else {
    ElMessage.error("账户密码校验失败");
  }
};

const register = () => {
  router.push("/register");
};

const toHome = () => {
  router.push("/home");
};
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}
.login-card {
  padding: 40px 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.07);
}
.btn-box {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>

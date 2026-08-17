<template>
  <div style="display: flex; justify-content: right">
    <el-dropdown>
      <span class="el-dropdown-link">姓名：{{ props.userInfo.name }}</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="toUserCenter">用户中心</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref } from "vue";
import request from "../utils/request";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useUserInfoStore } from "../stores/userInfo";

const route = useRoute();
const router = useRouter();
const userName = ref("");
const userInfoStore = useUserInfoStore();

const props = defineProps(["userInfo"]);

const getUserInfo = async () => {
  // console.log("lgjsd");
  const res = await request.get("/user/getInfo");
  // console.log("lgjsd");

  // console.log(res);
  // console.log("lgjsd");

  if (res.code === 200) {
    userName.value = res.data.name;
  } else {
  }
};

const toUserCenter = () => {
  router.push("/user-center");
};

const logout = () => {
  // 1. 删除satoken cookie（核心正确写法）
  document.cookie = "satoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  // 2. 调用后端退出接口
  request.post("/user/logout");
  // 3. 清空localStorage全部缓存
  localStorage.clear();
  //清理pinia
  userInfoStore.logout();
  // 5. 跳登录页
  router.push("/login");
};
</script>

<template>
  <div style="padding: 24px">
    <!--顶部头部卡片：头像+账号基础信息-->
    <el-card style="margin-bottom: 20px">
      <div style="display: flex; align-items: center; gap: 24px">
        <!--圆形头像：取名字第一个字-->
        <div
          style="
            width: 80px;
            height: 80px;
            background-color: #409eff;
            border-radius: 50%;
            color: white;
            font-size: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          {{ userInfoStore.name?.charAt(0) }}
        </div>
        <div>
          <h2 style="margin: 0 0 8px">{{ userInfoStore.name }}</h2>
          <p style="margin: 4px 0">角色：{{ roleText }}</p>
          <p style="margin: 4px 0">年龄：{{ userInfoStore.age }}</p>
        </div>
      </div>
    </el-card>

    <!-- 卡片一行两栏布局 -->
    <el-row :gutter="20">
      <!--学生卡片 只有role=1才显示-->
      <el-col :span="12" v-if="userInfoStore.role === 1">
        <el-card>
          <h4>学籍信息</h4>
          <p>学号：{{ userInfoStore.userNo }}</p>
          <p>联系电话：{{ userInfoStore.phone || "暂未填写" }}</p>
        </el-card>
      </el-col>

      <!--老师卡片 role=2-->
      <el-col :span="12" v-if="userInfoStore.role === 2">
        <el-card>
          <h4>教师信息</h4>
          <p>工号：{{ userInfoStore.userNo }}</p>
          <p>联系电话：{{ userInfoStore.phone || "暂未填写" }}</p>
        </el-card>
      </el-col>

      <!--管理员卡片 role=3 -->
      <el-col :span="12" v-if="userInfoStore.role === 3">
        <el-card>
          <h4>管理员</h4>
          <p>管理后台账号</p>
        </el-card>
      </el-col>

      <!--账号安全卡片-->
      <el-col :span="12">
        <el-card>
          <h4>账号安全</h4>
          <el-button type="primary" @click="pwdDialogVisible = true">
            修改密码
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="pwdDialogVisible" title="修改密码" width="420px">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input
            v-model="pwdForm.oldPwd"
            show-password
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            v-model="pwdForm.newPwd"
            show-password
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="pwdForm.confirmPwd"
            show-password
            placeholder="再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelPwdForm">取消</el-button>
        <el-button type="primary" @click="handleUpdatePwd">确认提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useUserInfoStore } from "../stores/userInfo";
import { computed, ref } from "vue";
import request from "../utils/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const userInfoStore = useUserInfoStore();
const pwdFormRef = ref();
const router = useRouter();

//弹窗控制
const pwdDialogVisible = ref(false);
//密码表单
const pwdForm = ref({
  oldPwd: "",
  newPwd: "",
  confirmPwd: "",
});

// 自定义校验
const validateConfirm = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请再次输入新密码"));
  }
  if (value !== pwdForm.value.newPwd) {
    callback(new Error("两次输入新密码不一致"));
  } else {
    callback();
  }
};

const pwdRules = ref({
  oldPwd: [{ required: true, message: "旧密码不能为空", trigger: ["blur", "input"] }],
  newPwd: [{ required: true, message: "新密码不能为空", trigger: ["blur", "input"] }],
  confirmPwd: [
    { required: true, message: "确认密码不能为空", trigger: ["blur", "input"] },
    {
      validator: validateConfirm,
      trigger: "blur",
    },
  ],
});

//角色数字转中文
const roleText = computed(() => {
  const map = {
    1: "学生",
    2: "老师",
    3: "管理员",
  };
  return map[userInfoStore.role] ?? "未知";
});

const logout = () => {
  // 1. 删除satoken cookie（核心正确写法）
  document.cookie = "satoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  // 2. 调用后端退出接口
  request.post("/user/logout");
  // 3. 清空localStorage全部缓存
  localStorage.clear();
  // 4. 清理pinia
  userInfoStore.logout();
  // 5. 跳登录页
  router.push("/login");
};

const resetForm = (formRef) => {
  const formEl = formRef.value;
  if (!formEl) return;
  formEl.resetFields();
};

const cancelPwdForm = () => {
  pwdDialogVisible.value = false;
  resetForm(pwdFormRef);
};
const handleUpdatePwd = async () => {
  await pwdFormRef.value.validate();
  const res = await request.post("/user/updatePassword", pwdForm.value);
  console.log(3233);
  console.log(res);
  if (res.code === 200) {
    pwdDialogVisible.value = false;
    ElMessage.success("修改密码成功，请重新登录");
    logout();
  } else {
    resetForm(pwdFormRef);
    ElMessage.error(res.msg);
  }
};
</script>

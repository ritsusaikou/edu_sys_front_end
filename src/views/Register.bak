<template>
  <div class="register-wrap">
    <div class="register-card">
      <h2 class="page-title">注册</h2>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="90px"
        class="register-form"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="ruleForm.role" placeholder="请选择角色">
            <el-option label="学生" value="1" />
            <el-option label="老师" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            :min="1"
            :max="150"
            v-model="ruleForm.age"
            placeholder="请输入年龄"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthdate">
          <el-date-picker
            v-model="ruleForm.birthdate"
            type="date"
            placeholder="请选择出生日期"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="照片" prop="photo">
          <el-input v-model="ruleForm.photo" placeholder="请上传照片" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            @input="handlePasswordNoSpace('password')"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="ruleForm.confirmPassword"
            type="password"
            :disabled="!ruleForm.password"
            placeholder="请再次输入密码"
            show-password
            @input="handlePasswordNoSpace('confirmPassword')"
          />
        </el-form-item>
        <el-form-item label="用户号" prop="userNo">
          <el-input v-model="ruleForm.userNo" placeholder="请输入用户号（学号/教师号）"></el-input>
        </el-form-item>

        <div class="btn-box">
          <el-button type="primary" @click="register(ruleFormRef)">注册</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="info" @click="toLogin">返回登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import request from "../utils/request";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const ruleFormRef = ref();

const ruleForm = reactive({
  name: "",
  role: "",
  age: "",
  phone: "",
  email: "",
  birthdate: "",
  photo: "",
  userNo: "",
  password: "",
  confirmPassword: "",
});

const rules = reactive({
  name: [
    { required: true, message: "姓名不能为空", trigger: "blur" },
    { min: 1, max: 10, message: "姓名长度范围1~10位", trigger: "blur" },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  age: [{ required: true, message: "年龄不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式错误", trigger: "blur" },
  ],
  email: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { pattern: /^[\w.-]+@[\w-]+\.\w+$/, message: "邮箱格式不正确", trigger: "blur" },
  ],
  birthdate: [{ required: true, message: "请选择出生日期", trigger: ["change", "blur"] }],
  userNo: [
    { required: true, message: "用户编号不能为空", trigger: "blur" },
    { min: 4, max: 20, message: "用户编号长度4~20位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, max: 16, message: "密码长度必须6~16位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请再次填写密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== ruleForm.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"],
    },
  ],
});

const handlePasswordNoSpace = (field) => {
  ruleForm[field] = ruleForm[field].replaceAll(/\s/g, "");
};

watch(
  () => ruleForm.password,
  () => {
    ruleForm.confirmPassword = "";
    ruleFormRef.value?.clearValidate("confirmPassword");
  }
);

const register = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      const res = await request.post("/user/registerByPhone", ruleForm);
      if (res.code === 200) {
        ElMessage.success("注册成功");
        router.push("/login");
      } else {
        ElMessage.error(res.msg);
      }
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const toLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding:20px 0;
}
.register-card {
  width: 460px;
  padding: 36px 32px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.07);
}
.page-title {
  text-align: center;
  margin:0 0 28px;
  font-weight:600;
}
.register-form {
  width: 100%;
}
.btn-box {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
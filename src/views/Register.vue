<template>
  Register
  <div style="display: flex; justify-content: center">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
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
        <el-col :span="17">
          <el-date-picker
            v-model="ruleForm.birthdate"
            type="date"
            placeholder="请选择出生日期"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="照片" prop="photo">
        <el-input v-model="ruleForm.photo" placeholder="请上传照片" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          style="width: 240px"
          type="password"
          placeholder="Please input password"
          show-password
          @input="handlePasswordNoSpace('password')"
        />
      </el-form-item>
      <el-form-item label="请确认密码" prop="confirmPassword">
        <el-input
          v-model="ruleForm.confirmPassword"
          style="width: 240px"
          type="password"
          :disabled="!ruleForm.password"
          placeholder="Please input password"
          show-password
          @input="handlePasswordNoSpace('confirmPassword')"
        />
      </el-form-item>
      <el-form-item label="用户号" prop="userNo">
        <el-input
          v-model="ruleForm.userNo"
          placeholder="请输入用户号（学号/教师号）"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register($refs.ruleFormRef)">注册</el-button>
        <el-button @click="resetForm($refs.ruleFormRef)">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="toLogin">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { ElForm } from "element-plus";
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
    { required: true, message: "手机号不能为空", tirgger: "blur" },
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
    { min: 1, max: 16, message: "密码长度必须6~16位", trigger: "blur" },
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
  // 全局匹配所有空格并删除
  ruleForm[field] = ruleForm[field].replaceAll(/\s/g, "");
};

watch(
  () => ruleForm.password,
  (newVal) => {
    ruleForm.confirmPassword = "";
    ruleFormRef.value?.clearValidate("confirmPassword");
  }
);

const register = async (formEl) => {
  // console.log("打印formEl", formEl);
  // 表单实例不存在，直接退出
  if (!formEl) return;
  // 执行表单全局校验
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await request.post("/user/registerByPhone", ruleForm);
      // console.log(res);
      if (res.code === 200) {
        ElMessage.success("注册成功");
        router.push("/login");
      } else {
        ElMessage.error(res.msg);
      }

      // 校验成功后发送后端请求
    } else {
      // console.log("错误提交", fields);
      // 校验失败，field可以拿到哪些字段报错
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

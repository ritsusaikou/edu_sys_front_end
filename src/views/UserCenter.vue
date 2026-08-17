<template>
  <div>
    <span> 消息</span>
    <el-input
      v-model="textarea1"
      style="width: 240px"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="Please input"
    />
  </div>
  <div>
    <span>输入待发送消息</span>
    <el-input
      v-model="textarea2"
      style="width: 240px"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="Please input"
    />
    <el-button type="primay" @click="sendMessage()">发送</el-button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import request from "../utils/request";
import { ElMessage } from "element-plus";
import { onMounted } from "vue";

const textarea1 = ref("");
const textarea2 = ref("");

const ws = new WebSocket("ws://127.0.0.1:8081");
ws.onopen = function () {
  console.log("我们连接成功了");
  ws.send("hello");
};
ws.onmessage = function (e) {
  console.log("服务端传来数据了：", e.data);
  textarea1.value = e.data;
};
ws.onclose = function () {
  console.log("连接关闭了");
};
ws.onerror = function (err) {
  console.log("连接失败了", err);
};

let timer = null;

const sendMessage = async () => {
  ws.send(textarea2.value);
};

//页面挂载之后开启定时器，每隔300ms查询一次后端返回消息
// onMounted(() => {
//   timer = setInterval(async () => {
//     const res = await request.get("/client/getReplyMsg");
//     if (res.code === 200 && res.data != null) {
//       textarea1.value = res.data;
//     }
//   }, 1000);
// });

// const sendMessage = async () => {
//   const res = await request.post(
//     "/client/sendMessage",
//     {},
//     { params: { msg: textarea2.value } }
//   );
//   textarea2.value = "";
//   if (res.code === 200) {
//     textarea1.value = res.data;
//   } else {
//     ElMessage.error("发送失败");
//   }
// };
</script>

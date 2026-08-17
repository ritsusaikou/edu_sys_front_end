<template>
  <div>
    <span>查询所有选课成绩单 </span>
    <span>
      <el-table :data="scoreTable">
        <template #empty>
          <div>暂无成绩数据</div>
        </template>
        <el-table-column label="编号" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="课程号" prop="courseNo"></el-table-column>
        <el-table-column label="课程名" prop="courseName"></el-table-column>
        <el-table-column label="成绩" prop="score"></el-table-column>
        <el-table-column label="操作一下">
          <template #default="scope">
            <el-button
              type="danger"
              @click="payRespectsToTeacher(scope)"
              v-if="scope.row.score !== '100'"
              >向老师表示敬意</el-button
            >
            <el-label v-else>你已经是最棒的了</el-label>
          </template>
        </el-table-column>
      </el-table>
    </span>
  </div>
  <div id="myDiv"></div>
  >
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import request from "../utils/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const scoreTable = ref([]);
const router = useRouter();

const payRespectsToTeacher = async (scope) => {
  // 1. axios携带satoken请求后端支付接口，登录校验通过
  const res = await request.get("/goPay", { scoreId: scope.row.id });
  console.log(res);
  document.getElementById("myDiv").innerHTML = res;


  // 获取表单，新窗口打开支付页面
  const payForm = document.forms[0];
  payForm.target = "_blank";
  payForm.submit();
};

const getScoreList = async () => {
  const res = await request.get("/score/getScoreList");
  if (res.code === 200) {
    scoreTable.value = res.data;
    ElMessage.success("成绩单查询完毕");
  } else {
    ElMessage.error("成绩单查询失败" + res.msg);
  }
};
onMounted(() => {
  getScoreList();
});
</script>

<template>
  <el-select
    v-model="courseId"
    placeholder="请选择课程"
    filterable
    style="margin-bottom: 16px; width: 300px"
    @change="getTableData()"
  >
    <el-option
      v-for="item in courseList"
      :label="`${item.courseName}(${item.courseNo})`"
      :key="item.courseId"
      :value="item.courseId"
    />
  </el-select>
  <div>
    <h3 style="text-align: center">学生成绩列表</h3>
    <el-table :data="tableData">
      <el-table-column label="学生姓名" prop="studentName"></el-table-column>
      <el-table-column label="学号" prop="studentNo"></el-table-column>
      <el-table-column label="班级" prop="classNo"></el-table-column>
      <el-table-column label="成绩">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.score"
            :min="1"
            :max="100"
          ></el-input-number>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="save(scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import request from "../utils/request";
import { ElMessage } from "element-plus";
const courseId = ref();
const tableData = ref([]);
const courseList = ref([]);
const courseName = ref("");

const getTableData = async () => {
  const res = await request.get("/score/getCourseScores", {
    courseId: courseId.value,
  });
  console.log(res);
  if (res.code === 200) {
    tableData.value = res.data;
    ElMessage.success("已获取本课程成绩");
  } else {
    ElMessage.error("获取本课程成绩失败");
  }
};

const getTaughtCourses = async () => {
  const res = await request.get("/course/getTaughtCourseList");
  console.log(res);
  if (res.code === 200) {
    courseList.value = res.data;
  } else {
    ElMessage.error(res.msg);
  }
};

const save = async (row) => {
  const res = await request.post("/score/update", null, {
    params: {
      scoreId: row.scoreId,
      score: row.score,
    },
  });
  if(res.code === 200){
    ElMessage.success("保存成功");
  }else{
    ElMessage.error("保存失败");
  }


};

onMounted(async () => {
  await getTaughtCourses();
  if (courseList.value.length > 0) {
    courseId.value = courseList.value[0].courseId;
  }
  await getTableData();
});
</script>

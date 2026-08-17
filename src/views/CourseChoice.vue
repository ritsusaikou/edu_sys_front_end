<template>
  CourseChoice

  <div>
    <template v-if="!tableData">
      <el-empty
        style="display: flex; justify-content: center; width: 100%"
        description="未查询到相关信息"
      />
    </template>

    <template v-else>
      <el-table :data="tableData">
        <el-table-column prop="courseId" label="课程id"></el-table-column>
        <el-table-column prop="courseNo" label="课程号"></el-table-column>
        <el-table-column prop="courseName" label="课程名"></el-table-column>
        <el-table-column label="授课教师">
          <template #default="scope">
            {{
              scope.row.teacherName
                ? `${scope.row.teacherName}(${scope.row.teacherNo})`
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              v-if="!scope.row.chosen"
              @click="chooseCourse(scope)"
              >选课</el-button
            >
            <el-button v-else type="danger" @click="dropCourse(scope)">退选</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <div>
    <span>已选课</span>
    <span>
      <el-table :data="chosenCourseTable">
        <el-table-column prop="courseId" label="课程id"></el-table-column>
        <el-table-column prop="courseNo" label="课程号"></el-table-column>
        <el-table-column prop="courseName" label="课程名"></el-table-column>
        <el-table-column label="授课教师">
          <template #default="scope">
            {{
              scope.row.teacherName
                ? `${scope.row.teacherName}(${scope.row.teacherNo})`
                : ""
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" @click="dropCourse(scope)">退选</el-button>
          </template>
        </el-table-column>
      </el-table>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import request from "../utils/request";
import { ElMessage } from "element-plus";
const tableData = ref([]);
const chosenCourseTable = ref([]);
const total = ref();
const currentPage = ref();
const pageSize = ref();
const courseId = ref("");

const getChosenCourseList = async () => {
  const res = await request.get("/courseChoice/getChosenCourseList");
  console.log(res);
  if (res.code == 200) {
    chosenCourseTable.value = res.data;
    ElMessage.success("成功获取已选课列表");
  } else {
    ElMessage.error(res.msg);
  }
};

const dropCourse = async (scope) => {
  const res = await request.delete("/courseChoice/dropCourse", {
    courseId: scope.row.courseId,
  });
  if (res.code === 200) {
    getCourseChoicePage();
    getChosenCourseList();
    ElMessage.success("退选成功");
  } else {
    ElMessage.error("退选失败");
  }
};

const chooseCourse = async (scope) => {
  courseId.value = scope.row.courseId;
  const res = await request.post("/courseChoice/chooseCourse", null, {
    params: {
      courseId: scope.row.courseId,
    },
  });
  if (res.code === 200) {
    getCourseChoicePage();
    getChosenCourseList();
    ElMessage.success("选课成功");
  } else {
    ElMessage.error("选课失败");
  }
};

const handleSizeChange = () => {
  getCourseChoicePage();
};
const handleCurrentChange = () => {
  getCourseChoicePage();
};
const getCourseChoicePage = async () => {
  const req = {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  };
  const res = await request.get("/courseChoice/getCourseChoicePage", req);
  console.log(res);
  if (res.code === 200) {
    tableData.value = res.data.pageData;
    ElMessage.success("成功拉取数据");
    total.value = res.data.totalCount;
    currentPage.value = res.data.currentPage;
    pageSize.value = res.data.pageSize;
  } else {
    ElMessage.error(res.msg);
  }
};

onMounted(() => {
  getCourseChoicePage();
  getChosenCourseList();
});
</script>

<template>
  管理员课程界面
  <div>
    <el-button type="primary" @click="addCourse">添加课程</el-button>
  </div>

  <div style="width: 100%">
    <el-table :data="tableData">
    <template #empty>
      <div>暂无课程数据</div>
    </template>
      <el-table-column type="index" label="序号" width="150"></el-table-column>
      <!-- <el-table-column prop="id" label="课程id"></el-table-column> -->
      <el-table-column prop="courseNo" label="课程号"></el-table-column>
      <el-table-column prop="courseName" label="课程名"></el-table-column>
      <!-- <el-table-column prop="userId" label="授课教师id"></el-table-column> -->
      <el-table-column label="授课教师">
        <template #default="scope">
          {{ scope.row.userName ? `${scope.row.userName}(${scope.row.userNo})` : "" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" @click="updateCourse(scope)">修改</el-button>
          <el-button type="danger" @click="deleteCourse(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div>
    <el-dialog v-model="dialogFormVisible" :title="title">
      <el-form :model="form">
        <el-form-item label="课程id" v-if="title === '修改课程'">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程号">
          <el-input v-model="form.courseNo"></el-input>
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="form.courseName"></el-input>
        </el-form-item>
        <el-form-item label="授课教师">
          <el-select v-model="form.userId" placeholder="请选择教师" filterable>
            <el-option
              v-for="item in teacherList"
              :label="`${item.teacherName}(${item.teacherNo})`"
              :key="item.teacherId"
              :value="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" v-if="title === '添加课程'" @click="submitAddCourse"
          >提交添加</el-button
        >
        <el-button type="primary" v-if="title === '修改课程'" @click="submitUpdateCourse"
          >提交修改</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </el-form>
    </el-dialog>
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
</template>

<script setup>
import { onMounted, ref } from "vue";
import request from "../utils/request";
import { ElMessage, SCOPE } from "element-plus";

const tableData = ref([]);
const total = ref();
const currentPage = ref();
const pageSize = ref();
const dialogFormVisible = ref(false);
const title = ref("");
const form = ref({});

const teacherList = ref([]);

const cancel = () => {
  dialogFormVisible.value = false;
};

const submitAddCourse = async () => {
  dialogFormVisible.value = false;
  const res = await request.put("/course/add", {
    id: form.value.id,
    courseNo: form.value.courseNo,
    courseName: form.value.courseName,
    userId: form.value.userId,
  });
  if (res.code === 200) {
    ElMessage.success("添加成功");
  } else {
    ElMessage.error(res.msg);
  }
};

const submitUpdateCourse = async () => {
  dialogFormVisible.value = false;
  const res = await request.put("/course/update", {
    id: form.value.id,
    courseNo: form.value.courseNo,
    courseName: form.value.courseName,
    userId: form.value.userId,
  });
  if (res.code === 200) {
    ElMessage.success("修改成功");
    getCoursePage();
  } else {
    ElMessage.error(res.msg);
  }
};

const addCourse = () => {
  form.value = {};
  dialogFormVisible.value = true;
  title.value = "添加课程";
};

const updateCourse = (scope) => {
  form.value = scope.row;
  dialogFormVisible.value = true;
  title.value = "修改课程";
};

const deleteCourse = async (scope) => {
  const courseId = scope.row.id;
  const res = await request.delete("/course/deleteById", {
    id: courseId,
  });
  // console.log("deleteCourse" + res);
  getCoursePage();
};

const getCoursePage = async () => {
  const req = {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  };

  const res = await request.get("/course/getPage", req);
  // console.log(res);
  if (res.code === 200) {
    tableData.value = res.data.pageData;
    ElMessage.success("成功拉取数据");
    total.value = res.data.totalCount;
    currentPage.value = res.data.currentPage;
    pageSize.value = res.data.pageSize;
    const res2 = await request.get("/user/getTeacherList");
    if (res2.code == 200) {
      teacherList.value = res2.data;
      console.log(res2);
    } else {
      ElMessage.error("res2.msg");
    }
  } else {
    ElMessage.error(res.msg);
  }
};
const handleSizeChange = () => {
  getCoursePage();
};

const handleCurrentChange = () => {
  getCoursePage();
};

onMounted(() => {
  getCoursePage();
});
</script>

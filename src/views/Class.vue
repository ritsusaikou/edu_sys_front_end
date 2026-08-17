<template>
  Class
  <div>
    <el-button type="primary" @click="addClass">添加班级</el-button>
  </div>
  <div style="width: 100%">
    <el-table :data="tableData">
      <template v-if="tableData.length === 0">
        <el-empty description="暂无班级数据" />
      </template>
      <template v-else>
        <el-table-column prop="id" label="班级id"></el-table-column>
        <el-table-column prop="college" label="学院"></el-table-column>
        <el-table-column prop="major" label="专业"></el-table-column>
        <el-table-column prop="classNo" label="班级号"></el-table-column>
        <el-table-column prop="userId" label="班主任id"></el-table-column>
        <el-table-column label="班主任">
          <template #default="scope">
            {{ scope.row.userName ? `${scope.row.userName}(${scope.row.userNo})` : "" }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button type="success" @click="updateClass(scope)">修改</el-button>
            <el-button type="danger" @click="deleteClass(scope)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
  <div>
    <el-dialog v-model="dialogFormVisible" :title="title">
      <el-form :data="form">
        <el-form-item label="班级id" v-if="title === '修改班级'">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="form.college"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.major"></el-input>
        </el-form-item>
        <el-form-item label="班级号">
          <el-input v-model="form.classNo"></el-input>
        </el-form-item>
        <el-form-item label="班主任">
          <el-select v-model="form.userId" placeholder="请选择班主任" filterable>
            <el-option
              v-for="item in teacherList"
              :label="`${item.teacherName}(${item.teacherNo})`"
              :key="item.teacherId"
              :value=item.teacherId
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitUpdateClass" v-if="title === '修改班级'"
        >提交修改</el-button
      >
      <el-button type="primary" @click="submitAddClass" v-if="title === '添加班级'"
        >提交添加</el-button
      >
      <el-button @click="cancel">取消</el-button>
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
import { ref, reactive, onMounted } from "vue";
import request from "../utils/request";
import { ElMessage } from "element-plus";

const tableData = ref([]);
const currentPage = ref();
const pageSize = ref();
const total = ref();
const title = ref("");
const dialogFormVisible = ref(false);
const form = ref({});
const teacherList = ref([]);


const cancel = () => {
  dialogFormVisible.value = false;
};
const submitAddClass = async () => {
  dialogFormVisible.value = false;
  const res = await request.put("/class/add", {
    id: form.value.id,
    userId: form.value.userId,
    college: form.value.college,
    major: form.value.major,
    classNo: form.value.classNo,
  });
  if (res.code === 200) {
    ElMessage.success("添加班级成功");
    getClassPage();
  } else {
    ElMessage.error(res.msg);
  }
};

const submitUpdateClass = async () => {
  dialogFormVisible.value = false;
  const res = await request.put("/class/update", {
    id: form.value.id,
    userId: form.value.userId,
    college: form.value.college,
    major: form.value.major,
    classNo: form.value.classNo,
  });
  if (res.code === 200) {
    ElMessage.success("修改班级成功");
    getClassPage();
  } else {
    ElMessage.error(res.msg);
  }
};

const updateClass = (scope) => {
  title.value = "修改班级";
  form.value = scope.row;
  dialogFormVisible.value = true;
};

const deleteClass = async (scope) => {
  const res = await request.delete("/class/deleteById", {
    id: scope.row.id,
  });
  if (res.code == 200) {
    ElMessage.success("删除班级成功");
    getClassPage();
  } else {
    ElMessage.error(res.msg);
  }
};

const addClass = () => {
  title.value = "添加班级";
  form.value = {};
  dialogFormVisible.value = true;
};

const getClassPage = async () => {
  const req = {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  };
  const res = await request.get("/class/getPage", req);
  console.log(res);
  if (res.code === 200) {
    tableData.value = res.data.pageData;
    total.value = res.data.totalCount;
    currentPage.value = res.data.currentPage;
    pageSize.value = res.data.pageSize;
    ElMessage.success("成功拉取数据");

    const res2 = await request.get("/user/getTeacherList");
    console.log(res2);
    if (res2.code === 200) {
      teacherList.value = res2.data;
      console.log(teacherList);
      ElMessage.success("成功获取教师列表");
    } else {
      ElMessage.error(res2.msg);
    }
  } else {
    ElMessage.error(res.msg);
  }
};
const handleSizeChange = () => {
  getClassPage();
};

const handleCurrentChange = () => {
  getClassPage();
};

onMounted(() => {
  getClassPage();
});
</script>

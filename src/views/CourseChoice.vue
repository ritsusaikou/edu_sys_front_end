<template>
  <div class="course-page">
    <!-- 顶部搜索区 -->
    <div class="search-box">
      <el-input
        v-model="searchCourseName"
        placeholder="输入课程名称搜索课程"
        class="search-input"
      />
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>


    <!-- 左右双栏主体 -->
    <div class="main-wrap">
      <!-- 左侧可选课程 -->
      <div class="panel left-panel">
        <div class="panel-header">可选课程列表</div>
        <!--新增滚动容器-->
        <div class="table-scroll">
          <template v-if="!tableData">
            <el-empty description="暂无课程数据"></el-empty>
          </template>
          <template v-else>
            <el-table :data="tableData" stripe>
             <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="courseNo" label="课程号" width="110"/>
              <el-table-column prop="courseName" label="课程名"/>
              <el-table-column label="授课教师" width="170">
                <template #default="scope">
                  {{ scope.row.teacherName ? `${scope.row.teacherName}` : "" }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90" align="center">
                <template #default="scope">
                  <el-button
                    v-if="!scope.row.chosen"
                    type="primary"
                    size="small"
                    @click="chooseCourse(scope)"
                  >选课</el-button>
                  <el-tag v-else type="success" size="small">已选中</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="pagination">
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
      </div>


      <!-- 右侧已选课程 -->
      <div class="panel right-panel">
        <div class="panel-header">我的已选课程</div>
        <!--新增滚动容器-->
        <div class="table-scroll">
          <template v-if="chosenCourseTable.length === 0">
            <el-empty description="暂未选择任何课程"></el-empty>
          </template>
          <template v-else>
            <el-table :data="chosenCourseTable" stripe>
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="courseNo" label="课程号" width="95"/>
              <el-table-column prop="courseName" label="课程名"/>
              <el-table-column label="授课教师" width="150">
                <template #default="scope">
                  {{ scope.row.teacherName ? `${scope.row.teacherName}` : "" }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="dropCourse(scope)">退选</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </div>
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


//===== 新增搜索变量 =====
const searchCourseName = ref("");


//===== 新增搜索方法 =====
const search = () => {
  currentPage.value = 1;
  getCourseChoicePage();
};
const resetSearch = () => {
  searchCourseName.value = "";
  currentPage.value = 1;
  getCourseChoicePage();
};


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
    courseChoiceId: scope.row.courseChoiceId,
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
    courseName: searchCourseName.value,
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


<style scoped>
.course-page {

}
/* 顶部搜索 */
.search-box {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  gap:12px;
  align-items: center;
  margin-bottom:20px;
}
.search-input {
  width: 340px;
}


/* 双栏容器 */
.main-wrap {
  display: flex;
  gap:20px;
}
.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.06);
  padding: 20px;
  max-height: 72vh;
  /*新增flex布局*/
  display: flex;
  flex-direction: column;
}
.left-panel {
  width:50%;
}
.right-panel {
  width:50%;
}
/*滚动容器样式*/
.table-scroll{
  flex: 1;
  overflow-y: auto;
  min-height: 220px;
}
/*美化滚动条*/
.table-scroll::-webkit-scrollbar {
  width:6px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background-color:#dcdfe6;
  border-radius:3px;
}
/* 面板标题 */
.panel-header {
  font-size:18px;
  font-weight:600;
  padding-left: 10px;
  border-left:4px solid #409eff;
  margin-bottom:16px;
  color:#303133;
}
.right-panel .panel-header{
  border-left-color:#67c23a;
}
/*分页*/
.pagination{
  margin-top:20px;
  text-align:center;
}
</style>
<template>
  <div class="score-wrap">
    <div class="page-title">查询所有选课成绩单</div>

    <!-- 统计卡片区域 -->
    <div class="stat-card-wrap">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-label">已修课程总数</div>
        <div class="stat-value">{{ stat.totalCourse }}</div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-label">平均分</div>
        <div class="stat-value">{{ stat.avgScore }}</div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-label">及格科目</div>
        <div class="stat-value">{{ stat.passCount }}</div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-label">满分科目</div>
        <div class="stat-value">{{ stat.fullCount }}</div>
      </el-card>
    </div>

    <!-- 表格滚动容器 -->
    <div class="table-scroll">
      <el-table :data="scoreTable" stripe>
        <template #empty>
          <div>暂无成绩数据</div>
        </template>
        <el-table-column label="编号" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="课程号" prop="courseNo" width="370"></el-table-column>
        <el-table-column label="课程名" prop="courseName" width="700"></el-table-column>
        <el-table-column label="成绩" prop="score" ></el-table-column>
        <!-- Tag 成绩等级标签 -->
        <el-table-column label="等级" >
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.score)" size="small">
              {{ getLevelText(scope.row.score) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="payRespectsToTeacher(scope)"
              v-if="scope.row.score !== '100'"
            >
              向老师表示敬意
            </el-button>
            <span v-else class="tip-text">你已经是最棒的了</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="myDiv"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import request from "../utils/request";
import { ElMessage } from "element-plus";

const scoreTable = ref([]);

// 统计数据
const stat = computed(() => {
  const list = scoreTable.value;
  if (!list || list.length === 0) {
    return {
      totalCourse: 0,
      avgScore: "0.00",
      passCount: 0,
      fullCount: 0
    };
  }
  const total = list.length;
  let sum = 0;
  let pass = 0;
  let full = 0;
  list.forEach(item => {
    const s = Number(item.score);
    sum += s;
    if (s >= 60) pass++;
    if (s === 100) full++;
  });
  const avg = (sum / total).toFixed(2);
  return {
    totalCourse: total,
    avgScore: avg,
    passCount: pass,
    fullCount: full
  };
});

// 根据成绩返回tag颜色
const getTagType = (score) => {
  const s = Number(score);
  if (s >= 90) return "success";
  if (s >= 80) return "";
  if (s >= 60) return "warning";
  return "danger";
};
// 等级文字
const getLevelText = (score) => {
  const s = Number(score);
  if (s >= 90) return "优秀";
  if (s >= 80) return "良好";
  if (s >= 60) return "及格";
  return "不及格";
};

const payRespectsToTeacher = async (scope) => {
  const res = await request.get("/goPay", {scoreId: scope.row.id });
  console.log(res);
  document.getElementById("myDiv").innerHTML = res;
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

<style scoped>
.score-wrap {
  padding: 24px;
}
.page-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
}
/*统计卡片布局*/
.stat-card-wrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card {
  text-align: center;
}
.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}
/*表格滚动容器*/
.table-scroll {
  max-height: 65vh;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}
.table-scroll::-webkit-scrollbar {
  width: 6px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}
.tip-text {
  color: #67c23a;
}

/*适配小屏幕自动换行*/
@media (max-width:768px) {
  .stat-card-wrap {
    grid-template-columns: repeat(2,1fr);
  }
}
</style>
<script setup>
import { getCurrentInstance, ref } from 'vue';
const { proxy } = getCurrentInstance()
const data = ref({
  bookCount: 150,
  borrowedBookCount: 140,
  readerCount: 100,
})

const info = () => {
  proxy.$api.home.info().then(res => {
    console.log(res);
    data.value = res
  })
}

info()

</script>
<template>
  <el-row :gutter="16">
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="data.bookCount">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Total number of books
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="data.borrowedBookCount">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Total number of books borrowed
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="statistic-card">
        <el-statistic :value="data.readerCount">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Total number of readers
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
</script>

<style scoped>

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
  display: flex;
  justify-content: center;
  text-align: center;
}

</style>

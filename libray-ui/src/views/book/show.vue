<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance()
const bookList = ref([
])

const page = ref({
  status: "inStock",
  page: 1,
  pageSize: 12,
  total: 0,
})

const find = () => {
  proxy.$api.book.list(page.value).then(res => {
    console.log(res);
    bookList.value = res.data
    page.value.total = res.total
  })
}

find()

const borrow = (data) => {
  console.log("borrow");
  ElMessageBox.confirm(
    'Are you sure you want to borrow this book?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      proxy.$api.book.borrow({
        _id: data._id
      }).then(res => {
        console.log(res);
        ElMessage({
          type: 'success',
          message: 'Borrow completed',
        })
        find()
      })
    })
}
</script>
<template>
  <div class="flex items-center justify-center min-w-full flex-col bg-white p-10 rounded">
    <el-row class="min-w-full">
      <el-col v-for="(val, index) in bookList" :key="index" :span="4">
        <el-card class="mb-4 mx-2" @click="borrow(val)">
          <div class="flex flex-col space-y-1">
            <div class="space-x-2">
              <el-image :src="val.cover" fit="cover" class="w-full" lazy></el-image>
            </div>
            <div class="space-x-2">
              <el-tag>Name</el-tag>
              <span>{{ val.name }}</span>
            </div>
            <div class="space-x-2">
              <el-tag>Author</el-tag>
              <span>{{ val.author }}</span>
            </div>
            <div class="space-x-2">
              <el-tag>ISBN</el-tag>
              <span>{{ val.isbn }}</span>
            </div>
            <div class="space-x-2">
              <el-tag>Price</el-tag>
              <span>{{ val.price }}</span>
            </div>
            <!-- <div class="space-x-2">
              <el-tag>Status</el-tag>
              <span>{{ val.status }}</span>
            </div> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination v-model:currentPage="page.page" :page-size="page.pageSize" layout="prev, pager, next"
      :total="page.total" @current-change="find"></el-pagination>
  </div>
</template>
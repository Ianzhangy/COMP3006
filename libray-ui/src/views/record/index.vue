<script setup>
import _ from 'lodash';
import { getCurrentInstance, ref } from 'vue';
import { useTokenStore } from '/@/store/token';
const tokenStore = useTokenStore()
const { proxy } = getCurrentInstance()
const defaultQuery = {
  libraryCard: "",
  bookName: "",
  status: "",
  page: 1,
  pageSize: 10,
  total: 0,
}

const query = ref(_.cloneDeep(defaultQuery))

const isReader = tokenStore.getInfo.role == "reader"

const statusList = [
  "borrowing",
  "returned"
]

const reset = () => {
  query.value = _.cloneDeep(defaultQuery)
}

const tableColProps = [
  // {
  //   "prop": "id",
  //   "label": "ID"
  // },
  {
    "prop": "libraryCard",
    "label": "Library Card"
  },
  {
    "prop": "bookName",
    "label": "Book Name"
  },
  {
    "prop": "readerName",
    "label": "Reader"
  },
  {
    "prop": "borrowDate",
    "label": "Borrow Date"
  },
  {
    "prop": "returnDate",
    "label": "Return Date"
  },
  {
    "prop": "status",
    "label": "Status",
    "type": "tag",
  }
]

const formProps = [
  {
    "prop": "status",
    "label": "Status"
  }
]

const tableData = ref([
])

const find = () => {
  console.log("find query: ", query.value);
  proxy.$api.record.list(query.value).then(res => {
    console.log(res);
    tableData.value = res.data
    query.value.total = res.total
  })
}

find()

const handleReturn = (data) => {
  console.log(data);
  proxy.$api.book.inStock(data).then(res => {
    console.log(res);
    find()
  })
}


</script>
<template>
  <List :page="query" :tableColProps="tableColProps" :tableDate="tableData" :formProps="formProps" @reset="reset"
    :showOperate="!isReader" @find="find">
    <template #header>
      <el-form :inline="true" :model="query">
        <el-form-item label="Library Card: " v-if="!isReader">
          <el-input v-model="query.libraryCard"></el-input>
        </el-form-item>
        <el-form-item label="Book Name: ">
          <el-input v-model="query.bookName"></el-input>
        </el-form-item>
        <el-form-item label="Status: ">
          <el-select v-model="query.status" placeholder="Select">
            <el-option v-for="item in statusList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #handler="{ row }">
      <el-button v-if="row.status == 'borrowing'" type="warning" @click="handleReturn(row)">Return</el-button>
    </template>
  </List>
</template>
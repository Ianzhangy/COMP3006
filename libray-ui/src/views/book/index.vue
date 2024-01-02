<script setup>
import _ from 'lodash';
import { getCurrentInstance, ref } from 'vue';
const { proxy } = getCurrentInstance()
const defaultQuery = {
  isbn: "",
  categoryId: "",
  name: "",
  status: "",
  page: 1,
  pageSize: 10,
  total: 0,
}


const statusList = ['inStock', 'borrowed']

const query = ref(_.cloneDeep(defaultQuery))

const categoryList = ref([
])

const getCategoryList = () => {
  proxy.$api.category.all().then(res => {
    console.log(res);
    categoryList.value = res
  })
}

getCategoryList()

const reset = () => {
  query.value = _.cloneDeep(defaultQuery)
}

const tableColProps = [
  // {
  //   "prop": "id",
  //   "label": "ID"
  // },
  {
    "prop": "isbn",
    "label": "ISBN"
  },
  {
    "prop": "name",
    "label": "Name"
  },
  {
    "prop": "categoryId",
    "label": "Category ID",
    "slotName": "showCategoryName"
  },
  {
    "prop": "author",
    "label": "Author"
  },
  {
    "prop": "price",
    "label": "Price"
  },
  {
    "prop": "language",
    "label": "Language"
  },
  {
    "prop": "status",
    "label": "Status"
  }
]

const formProps = [
  {
    "prop": "isbn",
    "label": "ISBN"
  },
  {
    "prop": "name",
    "label": "Name"
  },
  {
    "prop": "cover",
    "label": "Cover",
    "type": "img"
  },
  {
    "prop": "categoryId",
    "label": "Category ID"
  },
  {
    "prop": "author",
    "label": "Author"
  },
  {
    "prop": "price",
    "label": "Price"
  },
  {
    "prop": "language",
    "label": "Language"
  }
]

const formRules = {
  isbn: [
    { required: true, message: 'Please enter ISBN', trigger: 'blur' },
    { min: 10, max: 13, message: 'Length should be 10 to 13', trigger: 'blur' }
  ],
  name: [
    { required: true, message: 'Please enter name', trigger: 'blur' },
  ],
  cover: [
    { required: true, message: 'Please upload cover', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: 'Please select category', trigger: 'blur' },
  ],
  author: [
    { required: true, message: 'Please enter author', trigger: 'blur' },
  ],
  price: [
    { required: true, type: 'number', message: 'Please enter price', trigger: 'blur', transform: (value) => Number(value) },

  ],
  language: [
    { required: true, message: 'Please enter language', trigger: 'blur' },
  ]
}

const tableData = ref([
])

const find = () => {
  console.log("find query: ", query.value);
  proxy.$api.book.list(query.value).then(res => {
    console.log(res);
    tableData.value = res.data
    query.value.total = res.total
  })
}

find()

const add = (data) => {
  console.log(data);
  const formData = Object.assign({}, data)
  formData.cover = formData.cover[0].url
  proxy.$api.book.add(formData).then(res => {
    console.log(res);
    find()
  })
}

const update = (data) => {
  const formData = Object.assign({}, data)
  formData.cover = formData.cover[0].url
  proxy.$api.book.update(formData).then(res => {
    console.log(res);
    find()
  })
}

const handleDelete = (data) => {
  console.log(data);
  proxy.$api.book.delete({
    _id: data._id
  }).then(res => {
    console.log(res);
    find()
  })
}
</script>
<template>
  <List :page="query" :tableColProps="tableColProps" :tableDate="tableData" :formProps="formProps" :formRules="formRules"
    @reset="reset" @find="find" :showOperate="true" :showAdd="true" :showUpdate="true" :showDelete="true" @add="add"
    @update="update" @delete="handleDelete">
    <template #header>
      <el-form :inline="true" :model="query">
        <el-form-item label="ISBN: ">
          <el-input v-model="query.isbn"></el-input>
        </el-form-item>
        <el-form-item label="Name: ">
          <el-input v-model="query.name"></el-input>
        </el-form-item>
        <el-form-item label="Category: ">
          <el-select v-model="query.categoryId" placeholder="Select">
            <el-option v-for="item in categoryList" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status: ">
          <el-select v-model="query.status" placeholder="Select">
            <el-option v-for="item in statusList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #showCategoryName="{ row }">
      <span>{{ categoryList.find(item => item._id == row.categoryId)?.name }}</span>
    </template>
    <template #categoryId="{ formData }">
      <el-form-item label="Category" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="Select">
          <el-option v-for="item in categoryList" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
    </template>
  </List>
</template>
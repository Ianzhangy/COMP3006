<script setup>
import md5 from "js-md5";
import _ from 'lodash';

import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance()
const defaultQuery = {
  isbn: "",
  categoryId: "",
  name: "",
  page: 1,
  pageSize: 10,
  total: 0,
}

const query = ref(_.cloneDeep(defaultQuery))

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
    "prop": "username",
    "label": "Username"
  },
  {
    "prop": "realName",
    "label": "Real Name"
  },
  {
    "prop": "sex",
    "label": "Sex"
  },
  {
    "prop": "phone",
    "label": "Phone"
  },
  {
    "prop": "email",
    "label": "Email"
  },
]

const formProps = [
  {
    "prop": "libraryCard",
    "label": "Library Card"
  },
  {
    "prop": "username",
    "label": "Username"
  },
  {
    "prop": "realName",
    "label": "Real Name"
  },
  {
    "prop": "sex",
    "label": "sex",
  },
  {
    "prop": "phone",
    "label": "Phone"
  },
  {
    "prop": "email",
    "label": "Email"
  }

]

const formRules = {
  libraryCard: [
    { required: true, message: 'Please enter library card', trigger: 'blur' },
    { pattern: /^[0-9]{8}$/, message: 'Please enter correct library card, 8 numbers', trigger: 'blur' }
  ],
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
  ],
  realName: [
    { required: true, message: 'Please enter realName', trigger: 'blur' },
  ],
  sex: [
    { required: true, message: 'Please enter sex', trigger: 'blur' },

  ],
  phone: [
    { required: true, message: 'Please enter phone', trigger: 'blur' },
    // { pattern: /^1[3456789]\d{9}$/, message: 'Please enter correct phone', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/, message: 'Please enter correct email', trigger: 'blur' }
  ]
}

const tableData = ref([
])

const find = () => {
  console.log("find query: ", query.value);
  proxy.$api.reader.list(query.value).then(res => {
    console.log(res);
    tableData.value = res.data
    query.value.total = res.total
  })
}

find()

const add = (data) => {
  console.log(data);
  let addForm = Object.assign({}, data)
  addForm.password = md5(addForm.libraryCard)
  proxy.$api.reader.add(addForm).then(res => {
    console.log(res);
    find()
  })
}

const update = (data) => {
  console.log(data);
  proxy.$api.reader.update(data).then(res => {
    console.log(res);
    find()
  })
}

const handleDelete = (data) => {
  console.log(data);
  proxy.$api.reader.delete({
    _id: data._id
  }).then(res => {
    console.log(res);
    find()
  })
}
</script>
<template>
  <List :page="query" :tableColProps="tableColProps" :tableDate="tableData" :formProps="formProps" :formRules="formRules" @reset="reset"
    @find="find" :showOperate="true" :showAdd="true" :showUpdate="true" :showDelete="true" @add="add" @update="update"
    @delete="handleDelete">
    <template #header>
      <el-form :inline="true" :model="query">
        <el-form-item label="Library Card: ">
          <el-input v-model="query.libraryCard"></el-input>
        </el-form-item>
        <el-form-item label="Username: ">
          <el-input v-model="query.username"></el-input>
        </el-form-item>
        <el-form-item label="Phone: ">
          <el-input v-model="query.phone"></el-input>
        </el-form-item>
      </el-form>
    </template>

  </List>
</template>
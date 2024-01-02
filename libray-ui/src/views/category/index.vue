<script setup>
import _ from 'lodash';
import { getCurrentInstance, reactive, ref } from 'vue';
const { proxy } = getCurrentInstance()
const defaultQuery = {
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
    "prop": "name",
    "label": "Name"
  },
  {
    "prop": "description",
    "label": "Description"
  }
]

const formProps = [
  {
    "prop": "name",
    "label": "Name"
  },
  {
    "prop": "description",
    "label": "Description",
    "type": "textarea"
  }
]

const formRules = reactive({
  name: [
    { required: true, message: 'Please enter name', trigger: 'blur' },
  ],
  description: [
    { required: true, message: 'Please enter description', trigger: 'blur' },
  ]

})

const tableData = ref([
])

const find = () => {
  console.log("find query: ", query.value);
  proxy.$api.category.list(query.value).then(res => {
    console.log(res);
    tableData.value = res.data
    query.value.total = res.total
  })
}

find()

const add = (data) => {
  console.log(data);
  proxy.$api.category.add(data).then(res => {
    console.log(res);
    find()
  })
}

const update = (data) => {
  console.log(data);
  proxy.$api.category.update(data).then(res => {
    console.log(res);
    find()
  })
}

const handleDelete = (data) => {
  console.log(data);
  proxy.$api.category.delete({
    _id: data._id
  }).then(res => {
    console.log(res);
    find()
  })
}

</script>
<template>
  <List :page="query" :tableColProps="tableColProps" :tableDate="tableData" :formProps="formProps" :formRules="formRules"  @reset="reset" @find="find" :showAdd="true" :showOperate="true" :showUpdate="true" :showDelete="true" @add="add" @update="update" @delete="handleDelete">
    <template #header>
      <el-form :inline="true" :model="query">
        <el-form-item label="Name: ">
          <el-input v-model="query.name"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </List>
</template>
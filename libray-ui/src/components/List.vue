<template>
    <div class="p-10 bg-white min-h-full rounded">
        <el-card class="content-query">
            <slot name="header"></slot>
        </el-card>
        <div class="flex-end">
            <el-button @click="reset">Reset</el-button>
            <el-button type="primary" @click="find">Find</el-button>
            <el-button type="danger" @click="openAddForm" v-if="showAdd">Add</el-button>
            <slot name="btns"></slot>
        </div>
        <div class="content">
            <slot name="table">
                <el-table :data="tableDate" stripe :border="true" style="width: 100%">
                    <template v-for="(itemProps, index) in tableColProps" :key="index">
                        <el-table-column v-bind="itemProps" align="center">
                            <template #default="scope">
                                <slot :name="itemProps.slotName ? itemProps.slotName : itemProps.prop" :scope="scope"
                                    :row="scope.row" :index="scope.$index">
                                    <template v-if="!itemProps.type">
                                        {{
                                            scope.row[itemProps.prop], itemProps.prop
                                        }}
                                    </template>
                                    <template v-if="itemProps.type === 'datetime'">
                                        {{
                                            scope.row[itemProps.prop]
                                        }}
                                    </template>
                                    <template v-if="itemProps.type === 'map'">
                                        {{
                                            scope.row[itemProps.prop]
                                        }}
                                    </template>
                                    <template v-if="itemProps.type === 'img'">
                                        <img :src="scope.row[itemProps.prop]" alt="" width="100" height="100">
                                    </template>
                                    <template v-if="itemProps.type === 'tag'">
                                        <el-tag>
                                            {{
                                                scope.row[itemProps.prop]
                                            }}
                                        </el-tag>
                                    </template>
                                </slot>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="Operate" align="center" width="200" v-if="showOperate">
                        <template #default="scope">
                            <el-button type="warning" @click="openUpdateForm(scope.row)" v-if="showUpdate">Edit</el-button>
                            <el-button type="danger" @click="handleDelete(scope.row)" v-if="showDelete">Delete</el-button>
                            <slot name="handler" :scope="scope" :row="scope.row" :index="scope.$index"></slot>
                        </template>
                    </el-table-column>
                </el-table>
            </slot>
            <div class="flex-end mt-8">
                <el-pagination v-model:currentPage="page.page" :page-size="page.pageSize" layout="prev, pager, next"
                    :total="page.total" @current-change="find"></el-pagination>
            </div>
        </div>
        <el-dialog v-model="formVisiable" :title="title">
            <slot name="form">
                <el-form :model="formData" ref="formRef" :rules="formRules" label-position="left" label-width="150px">
                    <template v-for="(itemProps, index) in formProps" :key="index">
                        <slot :name="itemProps.slotName ? itemProps.slotName : itemProps.prop" :index="index"
                            :formData="formData">
                            <el-form-item :label="itemProps.label" :prop="itemProps.prop">
                                <template v-if="!itemProps.type">
                                    <el-input v-model="formData[itemProps.prop]"></el-input>
                                </template>
                                <template v-if="itemProps.type === 'textarea'">
                                    <el-input v-model="formData[itemProps.prop]" type="textarea" autosize></el-input>
                                </template>
                                <template v-if="itemProps.type === 'img'">
                                    <MyUpload v-model="formData[itemProps.prop]"></MyUpload>
                                </template>
                            </el-form-item>
                        </slot>
                    </template>
                </el-form>
            </slot>
            <div class="flex flex-row-reverse">
                <el-button type="primary" @click="emitSubmit">Confirm</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { defineEmits, defineProps, getCurrentInstance, ref } from 'vue';
import MyUpload from './MyUpload.vue';
const { proxy } = getCurrentInstance()
const emit = defineEmits(['reset', 'find', 'add', 'update'])


const props = defineProps({
    page: {
        type: Object,
        default: () => {
            return {
                page: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    showAdd: {
        type: Boolean,
        default: false
    },
    showUpdate: {
        type: Boolean,
        default: false

    },
    showDelete: {
        type: Boolean,
        default: false
    },
    tableDate: [],
    tableColProps: {},
    formProps: {},
    formRules: undefined,
    showOperate: {
        default: true
    }
})

console.log("props", props.tableColProps);

const formVisiable = ref(false)

const title = ref("Add")

const formRef = ref(null)

const formData = ref({
})


const openAddForm = () => {
    if (title.value != "Add") {
        let tmp = {}
        for (const item of props.formProps) {
            if (item.type == "img") {
                tmp[item.prop] = []
                continue
            }
            tmp[item.prop] = ""
        }
        formData.value = tmp
    }
    title.value = "Add"
    formVisiable.value = true

}

const openUpdateForm = (data) => {
    title.value = "Edit"
    formVisiable.value = true
    let tmp = Object.assign({}, data)
    for (const item of props.formProps) {
        if (item.type == "img") {
            tmp[item.prop] = [{ url: data[item.prop] }]
            continue
        }
        tmp[item.prop] = data[item.prop]
    }
    console.log(tmp);
    formData.value = tmp
}

const handleDelete = (data) => {
    emit('delete', data)
}


const reset = () => {
    emit('reset')
    emit('find')
}

const find = () => {
    emit('find')
}

const emitSubmit = () => {
    console.log(formData);

    proxy.$refs.formRef.validate(async (valid) => {
        if (valid) {
            formVisiable.value = false
            if (title.value == "Add") {
                emit('add', formData.value)
                let tmp = {}
                for (const item of props.formProps) {
                    if (item.type == "img") {
                        tmp[item.prop] = []
                        continue
                    }
                    tmp[item.prop] = ""
                }
                formData.value = tmp
            } else {
                emit('update', formData.value)
            }
        } else {

            return false;
        }
    });




}
</script>
<style scoped>
.content-query {
    margin-bottom: 20px;
    display: flex;

}

.flex-end {
    display: flex;
    justify-content: flex-end;
}

.content {
    margin-top: 20px;
    padding: 10;
}
</style>
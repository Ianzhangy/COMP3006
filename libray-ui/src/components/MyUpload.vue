<template>
  <el-upload
    action="/api/v1/images"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-success="handleSuccess"
    :file-list="modelValue"
    :limit="limit"
    accept="image/*"
    :on-exceed="onExceed"
  >
    <el-icon>
      <Plus />
    </el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script  setup>
import { Plus } from '@element-plus/icons-vue';
import { defineEmits, ref } from 'vue';

import { ElMessage } from 'element-plus';

const emit = defineEmits([ 'update:modelValue'])


const props = defineProps({
  modelValue: [],
  limit: {
    type: Number,
    default: 1
  }
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)


const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const handleSuccess = (response, _uploadFile, uploadFiles) => {
  uploadFiles[uploadFiles.length - 1].url = response.url
  emit('update:modelValue', uploadFiles)
}

const onExceed = () => {
  ElMessage.error('The number of files exceeds the limit!!!')
}

</script>
<template>
  <el-container class="h-full min-h-screen">
    <el-aside class="h-full min-h-screen w-1/5 max-w-50 flex flex-col bg-color-#3f3f3f color-white">
      <div class="h-20 flex p-2">
        <img :src="logo" class="mr-2 w-10" />
        <h3>Library</h3>
      </div>
      <el-menu :default-active="activeIndex" class="h-full" background-color="#3f3f3f" text-color="white" router>
        <template v-for="router in routes" :key="router.path">
          <el-menu-item v-if="!router.children || router.children.length == 0" :index="router.path">
            <span>{{ router.meta.name }}</span>
          </el-menu-item>
          <el-sub-menu v-else :index="router.path">
            <template #title>
              <span>{{ router.meta.name }}</span>
            </template>
            <el-menu-item :index="getAccessPath(router, child)" v-for="child in router.children">
              {{
                child.meta.name
              }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="p-2" height="40px">
        <div class="flex h-full w-full justify-end items-center">
          <span class="mr-2">{{ tokenStore.getInfo.username }}</span>
          <el-icon>
            <user-filled />
          </el-icon>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ nickname }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="changePassword">Change Password</el-dropdown-item>
                <el-dropdown-item command="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="w-full bg-slate-300" style="padding: 0;">
        <div class="min-h-9/10 h-9/10 p-5 mb-2">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>

      </el-main>
    </el-container>
    <el-dialog v-model="changePasswordVisiable" title="Change Password">
      <el-form :model="form" ref="formRef" label-width="150px" label-position="left" :rules="formRules">
        <el-form-item label="Old Password: " prop="oldPassword">
          <el-input v-model="form.oldPassword" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item label="New Password: " prop="newPassword">
          <el-input v-model="form.newPassword" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item label="Confirm Password: " prop="newPasswordBackup">
          <el-input v-model="form.newPasswordBackup" autocomplete="off" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="changePassword">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import _ from 'lodash';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import logo from '/@/assets/logo.svg';
import { realityRoutes } from '/@/router/index';
import { useTokenStore } from '/@/store/token';
const tokenStore = useTokenStore()
const { proxy } = getCurrentInstance()
const router = useRoute()
const routes = ref([])

import { useRouter } from 'vue-router';
// setup
const { currentRoute, push } = useRouter()
const activeIndex = ref(currentRoute.value.path)

onMounted(async () => {
  console.log("routes: ", realityRoutes);
  let tmp = []
  for (const route of realityRoutes) {
    if (route.meta && route.meta.show === true && (!route.meta.role || route.meta.role == tokenStore.getInfo.role)) {
      if (route.meta.flat) {
        for (const child of route.children) {
          if (!child.meta || !child.meta.show || child.meta.show !== true || (child.meta.role && child.meta.role != tokenStore.getInfo.role)) {
            continue
          }
          const _child = _.cloneDeep(child)
          let middle = "/"
          if (route.path.endsWith("/")) {
            middle = ""
          }
          _child.path = route.path + middle + _child.path
          tmp.push(_child)
        }
      } else {
        tmp.push(route)
      }
    }
  }
  tmp = _.cloneDeep(tmp)
  tmp.forEach(route => {
    route.children = route.children?.filter(child => {
      const result = child.meta && child.meta.show && child.meta.show === true
        && (!child.meta.role || child.meta.role == tokenStore.getInfo.role)
      return result
    })
  })
  routes.value = tmp
  console.log("routes: ", routes.value)
});


const key = computed(() => useRoute().name)

const getAccessPath = (parent, child) => {
  if (parent.path == "/") {
    return child.path
  }
  return parent.path + "/" + child.path
}

const form = ref({
  oldPassword: "",
  newPassword: "",
  newPasswordBackup: "",
})

const formRules = {
  oldPassword: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
  ],
  newPasswordBackup: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, max: 20, message: 'Length should be 6 to 20', trigger: 'blur' }
  ]
}

const changePasswordVisiable = ref(false)

const changePassword = () => {
  proxy.$refs.formRef.validate(async (valid) => {
    if (valid) {
      if (form.value.newPassword === form.value.newPasswordBackup) {
        proxy.$api.auth.changePassword({
          oldPassword: form.value.oldPassword,
          newPassword: form.value.newPassword,
        }).then(() => {
          changePasswordVisiable.value = false
          ElMessage({
            type: 'success',
            message: 'Change password successfully'
          })
        })
      } else {
        ElMessage.error('The two passwords are inconsistent')
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}

const handleCommand = (command) => {
  if (command == 'logout') {
    tokenStore.setToken("")
    tokenStore.setInfo("")
    push("/login")
  }
  if (command == 'changePassword') {
    changePasswordVisiable.value = true
    form.value = {
      oldPassword: "",
      newPassword: "",
      newPasswordBackup: "",
    }
  }
}


</script>

<style scoped>
.el-menu {
  border-right: 0 !important;
}
</style>
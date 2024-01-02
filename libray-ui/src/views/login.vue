<script setup>
import { Lock, User } from '@element-plus/icons-vue';
import md5 from "js-md5";
import { getCurrentInstance, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import { useTokenStore } from '/@/store/token';
const tokenStore = useTokenStore()
const router = useRouter()

const { proxy } = getCurrentInstance()
const loginRef = ref()

const loginRules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
  ]
}

const userType = [
  "admin",
  "reader"
]

// const form = reactive({
//   username: "12345678",
//   password: "12345678",
//   userType: "reader"
// })
const form = reactive({
  username: "",
  password: "",
  userType: "admin"
})

const login = () => {
  proxy.$refs.loginRef.validate(async (valid) => {
    if (valid) {
      console.log("login form: ", form);
      const res = await proxy.$api.auth.login({
        username: form.username,
        password: md5(form.password),
        userType: form.userType
      })
      console.log("login res: ", res);
      tokenStore.setToken(res.token)
      router.push({
        path: "/"
      })
    } else {
      console.log('error submit!!');
      return false;
    }
  });
  // router.push({
  //   path: "/"
  // })
}

</script>
<template>
  <div class="wrapper">
    <el-card class="p-5 ">
      <div class="title">
        <span>Library</span>
      </div>
      <div>
        <el-form state-icon ref="loginRef" :rules="loginRules" :model="form" label-width="0px" class="demo-ruleForm">
          <el-form-item prop="username" @keyup.enter.native="login">
            <el-input :prefix-icon="User" v-model="form.username" placeholder="Please enter usename" autofocus="off"
              autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" v-model="form.password" placeholder="Please enter password"
              autocomplete="off" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item prop="userType">
            <el-radio-group v-model="form.userType">
              <el-radio :label="item" :key="index" v-for="(item, index) in userType">{{ item }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="login-btn-wrapper">
              <el-button type="primary" size="large" @click="login" class="login-btn">login</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('/@/assets/bg.jpg');

  .title {
    text-align: center;
    font-size: 24px;
    color: black;
    margin-bottom: 1em;
  }

  .login-btn-wrapper {
    width: 100%;

    .login-btn {
      width: 100%;
    }
  }
}
</style>
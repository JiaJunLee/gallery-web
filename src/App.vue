<template>
  <div style="position: relative">
    <el-container style="padding-right: 260px;">
      <el-header class="header">
        <a id="logo" href="/"></a>
        <div>
          <div v-if="user">
            <el-button class="white--text header-btn" @click="uploadImageDialogVisible = true" type="text">上传</el-button>
            <v-avatar color="white" :size="38" v-if="user" @click="setUser(null)">
              <span class="black--text headline">{{ user.username.substr(0, 1).toUpperCase() }}</span>
            </v-avatar>
          </div>
          <div v-else>
            <el-button type="text" class="white--text header-btn" @click="loginDialogVisible = true">登录</el-button>
            <el-button type="success" @click="loginDialogVisible = true" class="register-btn">注册</el-button>
          </div>
          <el-dialog title="登录" :visible.sync="loginDialogVisible" width="40%">
            <el-form :model="loginUserForm">
              <el-form-item label="用户名" label-width="70px" required>
                <el-input v-model="loginUserForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" label-width="70px" required>
                <el-input v-model="loginUserForm.password" autocomplete="off" show-password></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="loginDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="userLogin">登 录</el-button>
            </div>
          </el-dialog>
          <el-dialog title="上传图片" :visible.sync="uploadImageDialogVisible" width="25%">
            <div style="width: 100%; display: flex; align-items: center; justify-content: center">
              <el-upload class="avatar-uploader" action="http://localhost:9999/v1/files" :limit="1" :on-success="handleUploadSuccess" :show-file-list="false" :before-upload="beforeUploadImage" ref="uploader">
                <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="uploadImageDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="uploadImage">上 传</el-button>
            </div>
          </el-dialog>
        </div>
      </el-header>
      <el-main class="main">
        <router-view ref="view"/>
      </el-main>
    </el-container>
    <div class="console">
      <div class="console-header">CONSOLE</div>
      <div class="console-list">
        <div class="log" v-for="(log, logIndex) in logs" :key="logIndex">
          <div class="log-icons">
            <span class="method">{{ log.method }}</span>
            <span class="response-code">{{ log.responseCode }}</span>
          </div>
          <div class="log-details">
            <span>URL: {{ log.url }}</span>
            <span>{{ log.timestamp }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Console from './console'
export default {
  name: 'App',
  data () {
    return {
      loginDialogVisible: false,
      loginUserForm: {
        username: '',
        password: ''
      },
      uploadImageDialogVisible: false,
      uploadImageForm: {

      },
      uploadImageUrl: '',
      uploadImageFileId: '',
      logs: []
    }
  },
  mounted () {
    Console.initialize(this.updateLogs)
  },
  methods: {
    userLogin () {
      this.$http.post('/user/login', this.loginUserForm).then(response => {
        this.loginDialogVisible = false
        this.setUser(response.data)
      }).catch(() => {
        this.$message.error('Login Failed')
      }).finally(() => {
        this.loginUserForm = {
          username: '',
          password: ''
        }
      })
    },
    handleUploadSuccess (res, file) {
      this.uploadImageUrl = URL.createObjectURL(file.raw)
      this.uploadImageFileId = res.id
    },
    uploadImage () {
      this.$http.post('/v1/images', {
        uploadUser: {
          id: this.user.id
        },
        imageFile: {
          id: this.uploadImageFileId
        }
      }).then(response => {
        this.uploadImageDialogVisible = false
        if (this.$refs.view && this.$refs.view.refreshImages) {
          this.$refs.view.refreshImages()
        }
      })
    },
    beforeUploadImage (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    updateLogs (logs) {
      this.logs = logs
    },
    ...mapMutations(['setUser'])
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    uploadImageDialogVisible () {
      this.uploadImageUrl = ''
      this.$refs.uploader.clearFiles()
    }
  }
}
</script>

<style>
  html, body {
    margin: 0;
    padding: 0;
  }
</style>
<style lang="scss">
  .header {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: {
      left: 60px;
      right: 320px;
    }
    justify-content: space-between;
    background-color: rgba(0,0,0,.2);
    position: absolute;
    top: 0;
    left: 0;
  }
  .main {
    padding: 0;
  }
  #logo {
    display: inline-block;
    width: 120px;
    height: 35px;
    background: url(https://pixabay.com/static/img/sprites.svg?a), none;
    background-position: 0 -380px;
  }
  .el-dialog__header {
    background-color: #409EFF;
    padding: 10px 20px !important;
  }
  .el-dialog__title, .el-dialog__headerbtn i {
    color: white !important;
  }
  .el-dialog__headerbtn {
    top: 13px !important;
  }
  .el-dialog__body {
    padding: 20px !important;
  }
  .el-dialog__footer {
    padding-top: 0 !important;
    .el-button + .el-button {
      margin-left: 15px;
    }
  }
  .header-btn {
    margin-right: 26px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    max-height: 200px;
    display: block;
  }
  .el-button.register-btn {
    padding: 7px 32px !important;
  }
  .el-button.upload-btn {
    padding: 6px 16px !important;
  }
  .console {
    position: fixed;
    top: 0;
    right: 0;
    width: 260px;
    height: 100%;
    border-left: 1px solid rgba(black, .1);
    background-color: white;
    .console-header {
      padding: 12px 26px;
      background-color: rgba(black, .3);
      font-size: 20px;
      font-style: italic;
      color: white;
    }
    .console-list {
      .log {
        padding: 18px 12px;
        cursor: pointer;
        border-bottom: 1px solid rgba(black, .15);
        display: flex;
        flex-direction: column;
        .log-icons {
          display: flex;
        }
        .method, .response-code {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          flex-shrink: 0;
          margin-right: 12px;
        }
        .method {
          background-color: cornflowerblue;
        }
        .response-code {
          background-color: indianred;
        }
        &:hover {
          background-color: rgba(black, .1);
        }
        .log-details {
          margin-top: 8px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          flex-direction: column;
          span {
            line-height: 22px;
          }
        }
      }
    }
  }
</style>

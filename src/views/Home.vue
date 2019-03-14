<template>
  <div class="home-container">
    <div class="jumbotron">
      <div class="jumbotron-content-wrapper">
        <div class="content">
          <h1 class="white--text title">惊人的免费图片</h1>
          <p class="white--text">发现我们慷慨的社区分享的 1.6 百万张图片和视频。</p>
        </div>
        <div class="search-wrapper">
          <el-input v-model="searchCriteria" clearable placeholder="搜索图像，矢量和视频" class="search-input" prefix-icon="el-icon-search" @keyup.enter.native="searchImages"></el-input>
        </div>
        <div class="pop-tags">
          <p class="content">热门: 科技, 花, 背景, 城市, 妇女节, 美女, 星空, 商务, 天空, 风景, 建筑, 春天</p>
        </div>
      </div>
    </div>
    <p class="search-tips" v-if="onSearch">为您匹配到 {{ images.length }} 条记录 ：</p>
    <div class="image-flow-wrapper" ref="imageFlowWrapper">
      <div class="image-line-wrapper" v-for="lineIndex in imageLineCount" :key="lineIndex">
        <div class="image" v-for="(image, imageIndex) in getLineImages(lineIndex)" :key="image.id"
             :style="{
             backgroundImage: getBackgroundImage(image.imageFile.fileContent),
             width: getImageWidth(image, lineIndex),
             marginRight: imageIndex < (getLineImages(lineIndex).length - 1) ? imageGutter + 'px' : 0
             }">
          <div class="image-actions" v-if="user">
            <el-button type="warning" icon="el-icon-edit-outline" @click="editImage(image)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteImage(image)">删除</el-button>
          </div>
          <div class="image-details">
            <span>标签: {{ getImageTag(image) }}</span>
            <span>类型: {{ image.imageType ? image.imageType.typeName : '无' }}</span>
            <span>创建日期: {{ image.createdDate }}</span>
            <span>尺寸: {{ image.imageWidth }} × {{ image.imageHeight }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="图片修改" :visible.sync="editImageDialogVisible" width="25%" v-if="currentEditImage">
      <div style="width: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column">
        <div style="width: 100%; margin-top: 12px;">
          <el-tag :key="tag" v-for="tag in currentEditImage.tags" closable :disable-transitions="false" @close="handleClose(tag)">{{ tag }}</el-tag>
          <el-input class="input-new-tag" v-if="inputTagVisible" v-model="inputTagValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputTagConfirm" @blur="handleInputTagConfirm"></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInputTag">+ New Tag</el-button>
        </div>
        <el-select v-model="currentEditImage.imageType.typeName" placeholder="请选择图片类型" style="width: 100%;" clearable>
          <el-option
            v-for="imageType in imageTypes"
            :key="imageType.id"
            :label="imageType.typeName"
            :value="imageType.typeName">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editImageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateImage">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      images: [],
      imageTypes: [],
      imageFlowWrapperWidth: 0,
      imageGutter: 20,
      searchCriteria: '',
      onSearch: false,
      editImageDialogVisible: false,
      currentEditImage: undefined,
      inputTagValue: '',
      inputTagVisible: false
    }
  },
  mounted () {
    this.refreshImages()
    this.refreshImageTypes()
    this.reduceImageFlowWrapperWidth()
    window.addEventListener('resize', this.reduceImageFlowWrapperWidth)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.reduceImageFlowWrapperWidth)
  },
  methods: {
    searchImages () {
      if (this.searchCriteria.trim()) {
        this.$http.get(`/v1/images/search?tags=${this.searchCriteria}`).then(response => {
          this.images = response.data
          this.onSearch = true
        })
      }
    },
    reduceImageFlowWrapperWidth () {
      this.imageFlowWrapperWidth = this.$refs.imageFlowWrapper ? this.$refs.imageFlowWrapper.offsetWidth : this.imageFlowWrapperWidth
    },
    refreshImages () {
      this.$http.get('/v1/images').then(response => {
        this.images = response.data.images
      })
    },
    refreshImageTypes () {
      this.$http.get('/v1/image-types').then(response => {
        this.imageTypes = response.data
      })
    },
    getBackgroundImage (base64) {
      return `url('data:image/jpeg;base64,${base64}')`
    },
    getImageTag (image) {
      if (image && image.tags.length > 0) {
        return image.tags.reduce((pre, cur) => {
          pre.push(cur)
          return pre
        }, []).join(', ')
      }
      return '无'
    },
    getLineImages (lineIndex) {
      return this.images.reduce((pre, cur, index) => {
        if (index >= this.imageLineImageCount * (lineIndex - 1) && index < this.imageLineImageCount * (lineIndex)) {
          pre.push(cur)
        }
        return pre
      }, [])
    },
    getImageWidth (image, lineIndex) {
      const lineImageWidth = this.getLineImages(lineIndex).reduce((pre, cur) => { pre += cur.imageWidth; return pre }, 0)
      const availWidth = this.imageFlowWrapperWidth - this.imageGutter * (this.getLineImages(lineIndex).length - 1)
      return availWidth * (image.imageWidth / lineImageWidth) + 'px'
    },
    deleteImage (image) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/v1/images/${image.id}`).then(() => {
          this.refreshImages()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editImage (image) {
      this.editImageDialogVisible = true
      this.currentEditImage = image
    },
    handleClose (tag) {
      this.currentEditImage.tags.splice(this.currentEditImage.tags.indexOf(tag), 1)
    },
    handleInputTagConfirm () {
      let inputValue = this.inputTagValue
      if (inputValue) {
        this.currentEditImage.tags.push(inputValue)
      }
      this.inputTagVisible = false
      this.inputTagValue = ''
    },
    showInputTag () {
      this.inputTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    updateImage () {
      this.$http.put('/v1/images', this.currentEditImage).then(response => {
        this.editImageDialogVisible = false
        this.currentEditImage = undefined
        this.refreshImages()
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    }
  },
  computed: {
    imageLineImageCount () {
      return parseInt(this.imageFlowWrapperWidth / 360)
    },
    imageLineCount () {
      return this.images.length > 0 && this.imageLineImageCount ? Math.ceil(this.images.length / this.imageLineImageCount) : 0
    },
    ...mapState(['user'])
  },
  watch: {
    searchCriteria (val) {
      if (!val || !val.trim()) {
        this.onSearch = false
        this.refreshImages()
      }
    }
  }
}
</script>

<style lang="scss">
  .home-container {
    display: flex;
    flex-direction: column;
  }
  .jumbotron {
    background-image: url("https://cdn.pixabay.com/index/2019/03/13/16-19-50-906_1920x430.jpg");
    width: 100%;
    height: 523px;
    background: {
      size: cover;
      position: center;
      repeat: no-repeat;
    }
  ;
    .jumbotron-content-wrapper {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 60px;
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
          font: bold 48px Helvetica, Arial, sans-serif !important;
          margin-bottom: 16px;
        }
        p {
          font: 21px Helvetica, Arial, sans-serif !important;
        }
      }
      .search-wrapper {
        width: 42%;
        height: 54px;
        margin-top: 16px;
        .search-input, .el-input__inner {
          width: 100%;
          height: 100%;
        }
        .el-input__inner {
          padding-left: 40px !important;
        }
        .el-input__icon {
          font-size: 22px !important;
        }
      }
      .pop-tags {
        margin-top: 32px;
        .content {
          font: 17px Helvetica, Arial, sans-serif !important;
          color: rgba(white, .45);
          cursor: pointer;
        }
      }
    }
  }
  .image-flow-wrapper {
    margin: 28px;
    .image-line-wrapper {
      margin-bottom: 20px;
      display: flex;
      .image {
        height: 280px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        &:hover .image-details {
          bottom: 0;
        }
        &:hover .image-actions {
          opacity: 1;
        }
        .image-actions {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(black, .3);
          opacity: 0;
          transition: opacity ease-in-out .1s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-details {
          position: absolute;
          left: 0;
          bottom: -39px;
          padding: 6px 16px;
          background-color: rgba(black, .3);
          display: flex;
          flex-direction: column;
          width: 100%;
          transition: bottom ease-in-out .1s;
          span {
            line-height: 18px;
            font-size: 12px;
            color: rgba(white, .6);
          }
        }
      }
    }
  }
  .search-tips {
    font-size: 15px;
    color: rgba(black, .5);
    font-weight: bold;
    margin: {
      bottom: 0 !important;
      left: 28px;
      top: 28px;
    };
  }
</style>

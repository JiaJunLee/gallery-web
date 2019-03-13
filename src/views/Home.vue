<template>
  <div class="home-container">
    <div class="jumbotron">
      <div class="jumbotron-content-wrapper">
        <div class="content">
          <h1 class="white--text title">惊人的免费图片</h1>
          <p class="white--text">发现我们慷慨的社区分享的 1.6 百万张图片和视频。</p>
        </div>
        <div class="search-wrapper">
          <el-input placeholder="搜索图像，矢量和视频" class="search-input" prefix-icon="el-icon-search"></el-input>
        </div>
        <div class="pop-tags">
          <p class="content">热门: 科技, 花, 背景, 城市, 妇女节, 美女, 星空, 商务, 天空, 风景, 建筑, 春天</p>
        </div>
      </div>
    </div>
    <div class="image-flow-wrapper" ref="imageFlowWrapper">
      <div class="image-line-wrapper" v-for="lineIndex in imageLineCount" :key="lineIndex">
        <div class="image" v-for="(image, imageIndex) in getLineImages(lineIndex)" :key="image.id" @click="deleteImage(image)"
             :style="{
             backgroundImage: getBackgroundImage(image.imageFile.fileContent),
             width: getImageWidth(image, lineIndex),
             marginRight: imageIndex < (getLineImages(lineIndex).length - 1) ? imageGutter + 'px' : 0
             }">
          <div class="image-details">
            <span>标签: {{ getImageTag(image) }}</span>
            <span>创建日期: {{ image.createdDate }}</span>
            <span>尺寸: {{ image.imageWidth }} × {{ image.imageHeight }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      images: [],
      imageFlowWrapperWidth: 0,
      imageGutter: 20
    }
  },
  mounted () {
    this.refreshImages()
    this.reduceImageFlowWrapperWidth()
    window.addEventListener('resize', this.reduceImageFlowWrapperWidth)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.reduceImageFlowWrapperWidth)
  },
  methods: {
    reduceImageFlowWrapperWidth () {
      this.imageFlowWrapperWidth = this.$refs.imageFlowWrapper ? this.$refs.imageFlowWrapper.offsetWidth : this.imageFlowWrapperWidth
    },
    refreshImages () {
      this.$http.get('/v1/images').then(response => {
        this.images = response.data
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
    }
  },
  computed: {
    imageLineImageCount () {
      return parseInt(this.imageFlowWrapperWidth / 360)
    },
    imageLineCount () {
      return this.images && this.imageLineImageCount ? Math.ceil(this.images.length / this.imageLineImageCount) : 0
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
    background-image: url("https://cdn.pixabay.com/index/2019/03/07/14-12-24-889_1920x430.jpg");
    width: 100%;
    height: 550px;
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
</style>

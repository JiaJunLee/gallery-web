<template>
  <div class="jumbotron">
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
</template>

<script>
export default {
  name: 'home',
  components: {
  }
}
</script>

<style lang="scss">
  .jumbotron {
    padding-top: 60px;
    background-image: url("https://cdn.pixabay.com/index/2019/03/07/14-12-24-889_1920x430.jpg");
    width: 100%;
    height: 550px;
    background: {
      size: cover;
      position: center;
      repeat: no-repeat;
    };
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        font: bold 48px Helvetica, Arial, sans-serif !important;
        margin-bottom: 16px;
      }
      p {
        font: 21px Helvetica,Arial,sans-serif !important;
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
        font: 18px Helvetica,Arial,sans-serif !important;
        color: rgba(0, 0, 0, .35);
        cursor: pointer;
      }
    }
  }
</style>

<template style="overflow: hidden">
  <el-container style="height: 100%;overflow: hidden;">
    <div id="music-bg"></div>

    <div id="music-main">
      <audio ref="audio" id="audio" :src="musicUrl"></audio>

      <!--      <el-header height="30">Header</el-header>-->
      <el-main class="music-list">
        <div>
          <el-input v-model="searchTerms"  placeholder="搜索"></el-input>
          <el-button plain style="margin-left: 8px">我的歌单</el-button>
          <el-button plain style="margin-left: 8px">推荐d歌单</el-button>
        </div>

        <!--     歌曲播放列表     -->
        <el-col :class="screenWidth > 992? 'playListWidth1':'playListWidth2'">
          <el-table
              @cell-mouse-enter="handleMouseEnter"
              @cell-mouse-leave="handleMouseLeave"
              ref="playList"
              id="playList"
              :data="tableData"
              :height="screenHeight"

              style="width: 100%">
            <el-table-column
                type="index"
                width="35">
            </el-table-column>

            <el-table-column
                prop="song"
                label="歌曲"
                width="auto">
              <template slot-scope="scope">
                <span v-if="scope.row.song!=null" class="cellHeight">{{ scope.row.song }}</span>
                <div style="float: right"><i class="iconfont ationIcon cellHeight icon-play"></i></div>
              </template>
            </el-table-column>
            <el-table-column
                prop="singer"
                label="歌手"
                min-width="30%">
            </el-table-column>
            <el-table-column
                v-if="screenWidth>600"
                prop="time"
                label="时长"
                width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.time!=null" class="cellHeight">{{ scope.row.time }}</span>
                <div v-if="scope.row.time!=null" style="float: right"><i
                    class="iconfont ationIcon cellHeight icon-delete"></i></div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <!--     歌曲图片和播放器作者信息     -->
        <el-col style="width: 350px" v-if="screenWidth>992">
          <el-row class="musicInfo">
            <el-row style="text-align: center">
              <img src="./img/player_cover.png" class="musicImg" alt="">
            </el-row>
            <!--  播放器信息 -->
            <el-row class="info">
              yumbo在线音乐播放器
            </el-row>
            <!--  作者github地址 -->
            <el-row class="info">
              <a href="https://github.com/1015770492" class="linkToGithub">诗水人间</a>
            </el-row>
          </el-row>
          <!--   播放时的歌词显示区域  -->
          <el-row class="lyric">
            <!--歌词-->
            <div ref="musicLyric" class="music-lyric">
              <div class="music-lyric-items">
                <p v-if="true">还没有播放音乐哦！</p>

              </div>
            </div>
          </el-row>

        </el-col>
      </el-main>


      <el-footer class="musicBar">
        <el-row :class="screenWidth < 600 ? 'playControl1' :'playControl2'">
          <!--    控制播放按钮  内部flex布局   -->
          <el-col :class="screenWidth < 600 ? 'controlButton1' : ' controlButton2'">
            <i class="iconfont icon-last"></i>
            <!--            <i class="iconfont ">&#xe60f;</i>-->
            <i class="iconfont pauseMusic icon-playBtn" id="playBtn" @click="playMusic"></i>
            <i class="iconfont icon-next"></i>
          </el-col>

          <!--    音乐播放进度条   根据屏幕宽度调整宽度   -->
          <el-col :class=" screenWidth < 600 ? 'sliderWidth1' : screenWidth < 768 ? 'sliderWidth2' : 'sliderWidth3'">
            <span class="songName">永不失联的爱</span>
            <span
                class="timeProgress">{{ this.formatTooltip(this.value2) + "/" + this.formatTooltip(this.value) }}</span>
            <!--            <lb-slider  v-model="value2"/>-->
            <el-slider v-model="value2" :max="value" :format-tooltip="formatTooltip"></el-slider>
          </el-col>
          <!--    右侧功能     -->
          <i :class="screenWidth < 600 ? 'iconfont icon-list-sequence switchBtn1' :'iconfont icon-list-sequence myFontStyle'"></i>
          <i :class=" screenWidth < 600 ? 'iconfont icon-comment switchBtn2' :'iconfont icon-comment myFontStyle' "></i>
          <div class="volumeIcon" v-show="screenWidth > 600 ">
            <!--            <i class="iconfont fontStyle">&#xe603;</i>-->
            <i class="iconfont myFontStyle icon-volumn-close"></i>
            <el-slider class="volumeSlider" v-if="screenWidth >= 768" v-model="volumeValue" :max="100"></el-slider>
          </div>


        </el-row>
      </el-footer>
    </div>

  </el-container>


</template>

<script>
export default {
  name: 'Music',
  data() {
    return {
      searchTerms:"",
      musicUrl: "https://music.163.com/song/media/outer/url?id=523250334.mp3",
      volumeValue: 60,
      value: 100,/*测试值，需要根据歌曲的时间变化，单位秒*/
      value2: 0,
      screenWidth: 991,
      screenHeight: 100,
      url: './img/bg1.jpg',
      hover: false,
      tableData: [
        {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: ""
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: ""
        },],
    }
  },
  methods: {
    handleMouseEnter(row, column, cell) {
      this.hover = true;
      console.log(cell)
    },
    handleMouseLeave() {
      console.log("离开")
    },
    formatTooltip(second) {
      return [Math.floor(second / 60 % 60), Math.floor(second % 60)].join(":")
          .replace(/\b(\d)\b/g, "0$1");
    },
    playMusic() {
      let that = this
      var audio = document.querySelector('#audio');
      this.musicUrl = "https://music.163.com/song/media/outer/url?id=523250334.mp3"
      audio.src = this.musicUrl
      let palyBth = document.getElementById("playBtn");

      if (palyBth.classList.contains("icon-playBtn")) {
        palyBth.classList.remove("icon-playBtn")
        palyBth.classList.add("icon-pauseBtn1")
        audio.play();
      } else {
        palyBth.classList.remove("icon-pauseBtn1")
        palyBth.classList.add("icon-playBtn")
        audio.pause();
      }
      setInterval(() => {
        that.value2 = audio.currentTime
        that.value = audio.duration
      })

    }
  },
  async mounted() {
    this.playMusic();
    this.playMusic();
    const that = this
    setInterval(window.onresize = () => {
      document.getElementById("playList").classList.remove("el-table--enable-row-hover")
      window.screenWidth = document.body.clientWidth
      that.screenHeight = document.body.clientHeight - 100 - 60
      // console.log("屏幕高度" + that.screenHeight)
      that.screenWidth = window.screenWidth
    })
  }

}
</script>

<style scoped lang="stylus" rel="stylessheet/stylus">

//定义的变量
maxWidth = 1750px
controlButtonWidth = 180px
headHeight = 60px
playHeight = 120px
playControlWidth = 300px
fluxPX = 12px
musicLRCWidth = 350px

i
  cursor: pointer
>>> .el-input
  min-width 250px
  width 30%
>>> .el-input__inner
  background-color #fff0
  border: 1px solid hsla(0,0%,100%,.6)
button
  background-color #86709000

>>> .el-button.is-plain:focus
  border-color white
  color white
  background-color #86709000

>>> .el-button
  background #86709000
  color hsla(0,0%,100%,.6)
  border-color  hsla(0,0%,100%,.6)
>>> .el-button:hover
  background-color #86709000
  border-color white
  color white


  //.icon-list-sequence
//  font-size: 14px;
//  position: absolute;
//  width: 60px;
//  height: 60px;
//  top: 40px;
//  left: 5px;
.pauseMusic
  border-radius: 20px;
  width: 40px;
  height: 40px;
  background-color: hsla(0, 0%, 100%, .4)
  text-align: center

.songName
  height 16px
  padding 5px 0
  font-size 3px
  color white

.timeProgress
  color white
  height 16px
  padding 5px 0
  font-size 3px
  float right

.icon-next, .icon-last
  font-size 30px

.icon-playBtn
  font-size 24px

.switchBtn1
  position absolute
  text-align center
  color white
  font-size 30px
  line-height 30px
  width 60px
  height 60px
  top 45px
  left 0

.switchBtn2
  position absolute
  text-align center
  color white
  font-size 30px
  line-height 30px
  width 60px
  height 60px
  top 45px
  right 0

.music-list
  overflow-y: hidden
  max-width maxWidth
  margin 0 auto
  padding: 15px 15px 0 15px;


.myFontStyle
  padding-top 5px
  margin-left 20px
  width 30px
  height 30px
  font-size: 25px;
  line-height 30px

.volumeIcon
  display flex

.volumeSlider
  padding 25px 0 0 10px
  width 115px

html, body
  overflow hidden
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;

/*阿里字体图标在线引入*/

@font-face {
  font-family: 'iconfont';  /* project id 2045485 */
  src: url('//at.alicdn.com/t/font_2045485_d2kdqcjywgg.eot');
  src: url('//at.alicdn.com/t/font_2045485_d2kdqcjywgg.eot?#iefix') format('embedded-opentype'),
      url('//at.alicdn.com/t/font_2045485_d2kdqcjywgg.woff2') format('woff2'),
      url('//at.alicdn.com/t/font_2045485_d2kdqcjywgg.woff') format('woff'),
      url('//at.alicdn.com/t/font_2045485_d2kdqcjywgg.ttf') format('truetype'),
      url('//at.alicdn.com/t/font_2045485_d2kdqcjywgg.svg#iconfont') format('svg');
}

.iconfont
  font-family: "iconfont" !important;
  font-style: normal;
  line-height 40px
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;


/**/

/**/

.cellHeight
  padding 0
  margin 0
  line-height 30px

.ationIcon
  font-size 30px
  color rgba(255, 255, 255, 0.6)


/*背景图片的样式*/
#music-bg
  background url("./img/bg1.jpg") no-repeat center center
  -webkit-background-size cover
  -moz-background-size cover
  -o-background-size cover
  background-size cover
  -webkit-filter blur(fluxPX)
  -moz-filter blur(fluxPX)
  -o-filter blur(fluxPX)
  -ms-filter blur(fluxPX)
  filter blur(fluxPX)
  transform scale(1.1)
  opacity .7
  z-index 1
  width 100%
  height 100%
  overflow hidden
  position absolute
  overflow hidden

#music-main
  flex-direction: column
  width 100%
  height 100%
  position absolute
  z-index 3
  overflow hidden
  background-color rgba(0, 0, 0, .4)

.musicBar
  max-width maxWidth
  padding-top 8px
  margin 0 auto
  flex content
  justify-content space-between

/*去除背景图片的白边*/
/*        头        */
.playMusicHead
  //background-color #867090
  height headHeight
  width 100%

/*        身体      */
.playMusicMain
  height 'calc(100%  - %s - %s)' % (headHeight playHeight)

.musicImg
  width: 201px
  height 180px
  background url('./img/album_cover_player.png') 0 0 no-repeat
  margin 0 auto


/*歌单的样式*/
.playListWidth1
  width 'calc(100%  - %s )' % (musicLRCWidth)

.playListWidth2
  width 100%


/*表格身体*/
>>> .el-table__body
  height 100%

/*去除单元格右填充*/
>>> .el-table .cell
  padding-right 0

/* 删除表格下横线 */
>>> .el-table::before
  left 0
  bottom 0
  width 100%
  height 0px

/* 表格表头字体颜色 */
>>> .el-table thead
  color #ffffff
  font-weight inherit
  font-size 14px
  font-family Arial

/*elementUI表格滚动条和字体颜色*/
>>> .el-table
  border-bottom 0
  color hsla(0, 0%, 100%, .6)
  /* 设置滚动条的样式 */

  ::-webkit-scrollbar
    width 5px;
    background-color: rgba(0, 0, 0, .3);

  ::-webkit-scrollbar-track
    display none
    border-radius 10px

  /* 滚动条滑块样式 */

  ::-webkit-scrollbar-thumb
    background-color hsla(0, 0%, 100%, .5)
    border-radius 10px

  ::-webkit-scrollbar-track-piece
    border-radius 10px


/*让ElementUi表格透明，外层透明*/
>>> .el-table, >>> .el-table__expanded-cell
  background-color transparent

/*去除hover显示背景色*/
>>> tr:hover
  background-color transparent

/* 表格内背景颜色 */
>>> .el-table th, >>> .el-table tr, >>> .el-table td
  background-color transparent
  border-bottom 1px solid hsla(0, 0%, 100%, .1)


/*歌词和专辑图*/
.lyric
  text-align center
  width 100%

.showMusicInfo
  height 100%
  margin 0 auto

.musicInfo
  padding-bottom 20px

.info
  padding 5px 0 0 0
  text-align center
  font-size 14px
  font-family "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif

.linkToGithub
  text-decoration none
  color rgba(255, 255, 255, 0.6)


/*          尾           */
.playControl1
  display flex
  flex-direction column-reverse

.playControl2
  color white
  font-size 24px
  padding-left 10px
  height playHeight
  display flex
  flex-direction row

/*上一首 播放暂停 下一首的布局*/
.controlButton2
  padding-top 10px
  width controlButtonWidth
  min-width 180px
  display flex
  justify-content space-between

.controlButton1
  margin 0 auto
  padding-top 20px
  order 3
  display flex
  justify-content space-between
  width 60%
  color white
  font-size 30px

/*滑块宽度*/
.sliderWidth1
  width 100%
  order 5

.sliderWidth2
  width calc(100% - 360px)
  padding-left 30px
  flex-grow 1

.sliderWidth3
  width calc(100% - 510px)
  padding-left 40px
  flex-grow 1

/* 进度条 */
>>> .el-slider__bar
  height 3px


/*进度条长度*/
>>> .el-slider__runway
  //width: 'calc(100%  - %s)' % (controlButtonWidth)
  width 100%
  height 3px
  margin 0
  background-color rgb(228, 231, 237)


/*     进度条圆点    */
>>> .el-slider__button
  width 5px
  height 5px

/*     圆点的位置调整    */
>>> .el-slider__button-wrapper
  top: -17px


</style>

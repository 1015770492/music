<template style="overflow: hidden">
  <el-container style="height: 100%;overflow: hidden;">
    <div id="music-bg"></div>

    <div id="music-main">
      <!-- 音乐播放控件 -->
      <audio ref="audio" id="audio" class="dn"
             :src="audio.musicUrl" :preload="audio.preload"
             @play="onPlay"
             @error="onError"
             @waiting="onWaiting"
             @pause="onPause"
             @timeupdate="onTimeupdate"
             @loadedmetadata="onLoadedmetadata"
      ></audio>
      <!--      <el-header height="30">Header</el-header>-->
      <!-- 播放列表和歌词布局 -->
      <el-main class="music-list">
        <div>
          <el-input v-model="searchTerms" placeholder="搜索"></el-input>
          <el-button plain style="margin-left: 8px">我的歌单</el-button>
          <el-button plain style="margin-left: 8px">推荐歌单</el-button>
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
                <div style="float: right">
                  <svg class="icon ationIcon cellHeight" aria-hidden="true">
                    <use xlink:href="#icon-play"></use>
                  </svg>
                </div>
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
                <div v-if="scope.row.time!=null" style="float: right">
                  <svg class="icon ationIcon cellHeight" aria-hidden="true">
                    <use xlink:href="#icon-delete"></use>
                  </svg>
                </div>
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

      <!-- 底部音频控制布局 播放音乐、暂停音乐 单曲循环、音量控制 -->
      <el-footer class="musicBar">
        <el-row :class="screenWidth < 600 ? 'playControl1' :'playControl2'">
          <!--    控制播放按钮  内部flex布局   -->
          <el-col :class="screenWidth < 600 ? 'controlButton1' : ' controlButton2'">
            <svg class="icon icon-last" aria-hidden="true">
              <use xlink:href="#icon-last"></use> <!-- 播放上一首图标 -->
            </svg>
            <svg id="playMusicBtn" class="icon palyBtnStyle" aria-hidden="true" @click="startPlayOrPause">
              <use v-show="!showPauseBtn" xlink:href="#icon-playBtn"></use> <!-- 播放按钮 -->
              <use v-show="showPauseBtn" xlink:href="#icon-pauseBtn"></use> <!-- 暂停按钮 -->
            </svg>
            <svg class="icon icon-next" aria-hidden="true">
              <use xlink:href="#icon-next"></use><!-- 播放下一首图标 -->
            </svg>
          </el-col>

          <!--    音乐播放进度条   根据屏幕宽度调整宽度   -->
          <el-col :class=" screenWidth < 600 ? 'sliderWidth1' : screenWidth < 768 ? 'sliderWidth2' : 'sliderWidth3'">
            <span class="songName">{{ audio.songName }}</span><!-- 当前播放的歌曲名称 -->
            <span class="timeProgress">
              <!--  歌曲播放的时间 和 歌曲时长   -->
              {{ this.formatTooltip(audio.currentTime) + "/" + this.formatTooltip(this.audio.maxTime) }}
            </span>
            <!-- 右侧歌词面板隐藏后，显示这个mini歌词 -->
            <span v-show="screenWidth < 991" class="miniLyric">歌词</span>
            <el-slider :max="value" v-model="sliderTime" :show-tooltip="false"
                       @change="changeCurrentTime"></el-slider><!--  播放音乐的进度条  -->
          </el-col>
          <!-- 下面是最右侧的图标   播放模式切换图标： 顺序播放、随机播放、单曲循环     -->
          <svg class="icon" :class="screenWidth < 600 ? 'listSequenceStyle2' :'myFontStyle'" @click="changeMode"
               aria-hidden="true">
            <use v-show="audio.mode==1" xlink:href="#icon-circleOnlyOne"></use><!-- 单曲循环-->
            <use v-show="audio.mode==2" xlink:href="#icon-list-sequence"></use><!-- 列表循环-->
            <use v-show="audio.mode==3" xlink:href="#icon-random"></use><!-- 随机播放-->
          </svg>
          <!--    评论图标    -->
          <svg class="icon" :class="screenWidth < 600 ? 'commentStyle2' : 'myFontStyle'" aria-hidden="true">
            <use xlink:href="#icon-el-icon-chat"></use>
          </svg>
          <!--    音量控制    -->
          <div class="volumeIcon" v-show="screenWidth > 600 ">
            <!-- 静音或取消静音图标 -->
            <svg class="icon myFontStyle" aria-hidden="true" @click="startMutedOrNot">
              <use v-show="!audio.muted" xlink:href="#icon-volume"></use><!--喇叭图标-->
              <use v-show="audio.muted" xlink:href="#icon-volumn-close"></use><!--静音图标-->
            </svg>
            <el-slider class="volumeSlider" v-if="screenWidth >= 768" :max="100" v-model="audio.volume"
                       :format-tooltip="formatVolumeToolTip" @change="changeVolume"></el-slider><!--音量条-->
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
      showPauseBtn: false,// 显示播放按钮
      audio: {
        mode: 2,// 1表示单曲循环、2表示顺序播放、3表示随机播放
        musicUrl: "https://music.163.com/song/media/outer/url?id=523250334.mp3",// 歌曲的播放地址
        coverImg: './img/bg1.jpg',// 封面图片
        songName: '当前歌曲名称',// 歌曲名称
        currentTime: 0, // 当前播放音乐的时间
        maxTime: 0,     // 音乐的总时间
        volume: 50,     // 音量值
        tempVolume: 0,  // 临时音量，用于记录静音前的音量值
        volumeMax: 100,  // 最大音量值
        playing: false, // 是否正在播放
        muted: false,   // 是否静音
        speed: 1,// 播放速度
        waiting: false,// 正在等待音乐资源
        preload: 'auto' // 自动预加载
      },
      controlList: {
        // 不显示下载
        noDownload: false,
        // 不显示静音
        noMuted: false,
        // 不显示音量条
        noVolume: false,
        // 不显示进度条
        noProcess: false,
        // 只能播放一个
        onlyOnePlaying: false,
        // 不要快进按钮
        noSpeed: false
      },
      value: 100,
      searchTerms: "",
      sliderTime: 0,
      screenWidth: 991,
      screenHeight: 100,
      url: './img/bg1.jpg',
      hover: false,
      tableData: [
        {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: this.prefix + "5352857836" + this.suffix
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: this.prefix + "2821115454" + this.suffix
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: this.prefix + "5344048011" + this.suffix
        },
        {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: this.prefix + "5352857836" + this.suffix
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: this.prefix + "2821115454" + this.suffix
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: this.prefix + "5344048011" + this.suffix
        }, {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: this.prefix + "5352857836" + this.suffix
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: this.prefix + "2821115454" + this.suffix
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: this.prefix + "5344048011" + this.suffix
        }, {
          song: '会不会（吉他版）',
          singer: '刘大壮',
          time: '3:41',
          musicUrl: this.prefix + "5352857836" + this.suffix
        }, {
          song: '经济舱 (Live)',
          singer: 'Kafe.Hu',
          time: '3:41',
          musicUrl: this.prefix + "2821115454" + this.suffix
        }, {
          song: '他只是经过',
          singer: 'h3R3/Felix Bennett',
          time: '3:41',
          musicUrl: this.prefix + "5344048011" + this.suffix
        },],
    }
  },
  methods: {
    changeMode() {
      this.audio.mode = (this.audio.mode + 1) % 3 + 1 // 得到1，2，3不断的循环
    },
    setControlList() {
      let controlList = this.theControlList.split(' ')
      controlList.forEach((item) => {
        if (this.controlList[item] !== undefined) {
          this.controlList[item] = true
        }
      })
    },
    changeSpeed() {
      let index = this.speeds.indexOf(this.audio.speed) + 1
      this.audio.speed = this.speeds[index % this.speeds.length]
      this.$refs.audio.playbackRate = this.audio.speed
    },
    startMutedOrNot() {
      this.$refs.audio.muted = !this.$refs.audio.muted
      this.audio.muted = this.$refs.audio.muted
      if (this.$refs.audio.muted == true) {
        this.audio.tempVolume = this.audio.volume //保存静音前的音量值
        this.audio.volume = 0;// 将音量设置为0
      } else {
        this.audio.volume = this.audio.tempVolume //还原到静音前的音量值
      }
    },
    // 音量条toolTip
    formatVolumeToolTip(index) {
      return '音量条: ' + index
    },
    // 进度条toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt(this.audio.maxTime / 100 * index + '')
      return '进度条: ' + this.formatTooltip(index)
    },
    // 音量改变
    changeVolume(index = 0) {
      this.$refs.audio.volume = index / 100
      this.volume = index
    },
    // 播放跳转
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime + '')
    },
    startPlayOrPause() {
      this.showPauseBtn = !this.showPauseBtn // 进行样式的切换
      return this.audio.playing ? this.pausePlay() : this.startPlay()
    },
    // 开始播放
    startPlay() {
      this.$refs.audio.play()
    },
    // 暂停
    pausePlay() {
      this.$refs.audio.pause()
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
    },
    // 当发生错误, 就出现loading状态
    onError() {
      this.audio.waiting = true
    },
    // 当音频开始等待
    onWaiting(res) {
      console.log(res)
    },
    // 当音频开始播放
    onPlay(res) {
      console.log(res)
      this.audio.playing = true
      this.audio.loading = false

      if (!this.controlList.onlyOnePlaying) {
        return
      }

      let target = res.target

      let audios = document.getElementsByTagName('audio');

      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause()
        }
      })
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = (res.target.currentTime / this.audio.maxTime) * 100
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      console.log('loadedmetadata')
      console.log(res)
      this.audio.waiting = false
      this.audio.maxTime = parseInt(res.target.duration)
    },


    /**
     *
     */
    handleMouseEnter(row, column, cell) {
      this.hover = true;
      console.log(cell)
    },
    handleMouseLeave() {
      console.log("离开")
    },
    /**
     * 格式化时间
     */
    formatTooltip(second) {

      return [Math.floor(second / 60 % 60), Math.floor(second % 60)].join(":")
          .replace(/\b(\d)\b/g, "0$1");
    },

  },
  async mounted() {
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
// 歌曲名称样式
.songName
  height 16px
  padding 7px 0
  font-size 7px
  color white

// 屏幕宽带<991时显示迷你歌词，也就是右侧歌词显示消失时显示它
.miniLyric
  font-size 14px
  padding-left 20px
  color wheat

// 鼠标移到到svg图标上时改变鼠标指针样式为小手
svg
  cursor: pointer

>>> .el-input
  min-width 250px
  width 30%

// elementUI输入框样式
>>> .el-input__inner
  background-color #fff0
  border: 1px solid hsla(0, 0%, 100%, .6)

button
  background-color #86709000

>>> .el-button.is-plain:focus
  border-color white
  color white
  background-color #86709000

>>> .el-button
  background #86709000
  color hsla(0, 0%, 100%, .6)
  border-color hsla(0, 0%, 100%, .6)

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
.palyBtnStyle
  border-radius: 20px;
  width: 40px;
  height: 40px;
  background-color: hsla(0, 0%, 100%, .4)


.timeProgress
  color white
  height 16px
  padding 5px 0
  font-size 3px
  float right

.icon-next, .icon-last
  padding-top 6px;
  font-size 26px

// 顺序播放、单曲循环图标样式切换
.listSequenceStyle2
  position absolute
  text-align center
  color white
  font-size 30px
  line-height 30px
  width 35px
  height 35px
  top 48px
  left -4px

.commentStyle2
  position absolute
  text-align center
  color white
  font-size 30px
  line-height 30px
  width 35px
  height 35px
  top 48px
  right 2px

.music-list
  overflow-y: hidden
  max-width maxWidth
  margin 0 auto
  padding: 15px 15px 0 15px;


.myFontStyle
  padding-top 5px
  margin-top 10px;
  margin-left 20px
  width 30px
  height 30px
  font-size: 25px;
  line-height 30px

.volumeIcon
  display flex

.volumeSlider
  margin-top 7px
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

<template>
  <div class="page" ref="page">
    <!-- <div style="background-color: #fff">
      <cube-tab-bar
        v-model="selectedLabel"
        :use-transition="false"
        show-slider
        :data="tabLabels"
        ref="tabNav"
      ></cube-tab-bar>
    </div> -->
    <!-- <cube-scroll
      class="page"
      :options="outWrapperOptions"
      :scrollEvents="['scroll']"
      @scroll="scrollOutWrapper"
    > -->
    <div class="top">
      <div class="top-bar" ref="topBar">
        <van-icon name="arrow-left" size="24px" @click="goBack" />
        <van-icon name="search" size="24px" />
      </div>
      <div class="bg" ref="topBg">
        <div
          class="bg-img"
          :style="{
            backgroundImage: `url(${djDetail.picUrl})`,
          }"
        ></div>
      </div>
      <div class="info">
        <div class="cover">
          <div
            class="cover-pic"
            :style="{
              backgroundImage: `url(${djDetail.picUrl})`,
            }"
          ></div>
        </div>
        <div class="right">
          <div class="name">{{ djDetail.name }}</div>
          <div class="nickname" v-if="djDetail.dj">
            <div
              class="avatar"
              :style="{ backgroundImage: `url(${djDetail.dj.avatarUrl})` }"
            ></div>
            <div>{{ djDetail.dj.nickname }}</div>
          </div>
        </div>
      </div>
      <div class="bottom-bar">
        <div class="bottom-bar-control">
          <div class="item">
            <van-icon name="star-o" />
            <div class="number">{{ djDetail.subCount || "-" }}</div>
          </div>
          <div class="item">
            <van-icon name="chat-o" />
            <div class="number">{{ djDetail.commentCount || "-" }}</div>
          </div>
          <div class="item">
            <van-icon name="share-o" />
            <div class="number">{{ djDetail.shareCount || "-" }}</div>
          </div>
        </div>
      </div>
    </div>
    <div style="background-color: #fff">
        <cube-tab-bar
          v-model="selectedLabel"
          :use-transition="false"
          show-slider
          :data="tabLabels"
          ref="tabNav"
        ></cube-tab-bar>
      </div>

    <div class="content" ref="content">
      <cube-slide
        ref="slide"
        :loop="false"
        :initial-index="initialIndex"
        :auto-play="false"
        :show-dots="false"
        :options="slideOptions"
        @scroll="scroll"
        @change="changePage"
      >
        <cube-slide-item>
          <!-- <van-list
              v-model="pager.loading"
              :finished="!pager.more"
              @load="loadProgram"
            >
              <div
                class="music-item"
                v-for="item in programs"
                :key="'record_' + item.id"
                @click="playMusic(item.id)"
              >
                <div class="pic">
                  <img class="pic-img" :src="item.coverUrl" alt="" />
                </div>
                <div class="right">
                  <div class="title">{{ item.name }}</div>
                  <div class="sub-title">
                    <div class="time">
                      {{ new Date(item.createTime).format("yyyy-MM-dd") }}
                    </div>
                    <div class="play-count">
                      <van-icon class="icon" name="play-circle-o" />{{
                        item.listenerCount
                      }}
                    </div>
                    <div class="duration">
                      <van-icon class="icon" name="clock-o" />{{
                        $utils.second2mmss(item.duration)
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </van-list> -->
          <cube-scroll :nestMode="'none'" :options="scrollOptions" @pulling-up="getPrograms">
            <div class="music-list">
              <div
                class="music-item"
                v-for="item in programs"
                :key="'record_' + item.id"
                @click="playMusic(item.mainSong.id, item.name, item.coverUrl)"
              >
                <div class="pic">
                  <img class="pic-img" :src="item.coverUrl" alt="" />
                </div>
                <div class="right">
                  <div class="title">{{ item.name }}</div>
                  <div class="sub-title">
                    <div class="time">
                      {{ new Date(item.createTime).format("yyyy-MM-dd") }}
                    </div>
                    <div class="play-count">
                      <van-icon class="icon" name="play-circle-o" />{{
                        item.listenerCount
                      }}
                    </div>
                    <div class="duration">
                      <van-icon class="icon" name="clock-o" />{{
                        $utils.second2mmss(item.duration)
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </cube-scroll>
        </cube-slide-item>
        <cube-slide-item>
          <div class="music-detail"></div>
        </cube-slide-item>
      </cube-slide>
    </div>
    <!-- </cube-scroll> -->
  </div>
</template>

<script>
import { api_getPrograms, api_getDjDetail, api_getSongUrl } from "@/http/apis/music.js";
import { mapState } from 'vuex';
export default {
  components: {},
  data() {
    return {
      resourceId: "",
      title: "",
      coverPic: "",
      djDetail: {},
      programs: [],
      pager: {
        page: 1,
        asc: false, // 新-老
        limit: 30,
        total: 0,
        more: true,
        loading: false,
      },
      loading: false,

      index: 0,
      bxoNum: 2, // 选项卡个数
      isMove: true,
      marginLeft: 0,
      scrollLeft: 0,
      startScrollLeft: 0,
      startX: 0,
      startY: 0,
      moveX: 0,
      moveY: 0,
      endX: 0,
      endY: 0,
      m_sX: 0,
      m_sY: 0,
      e_sX: 0,
      e_sY: 0,
      sML: 0,

      selectedLabel: "音乐",
      tabLabels: [
        {
          label: "音乐",
        },
        {
          label: "详情",
        },
      ],

      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0,
        eventPassthrough: "vertical",
      },

      scrollOptions: {
        probeType: 3,
        directionLockThreshold: 0,
        pullUpLoad: {
          threshold: 0,
          visible: true,
        }
      },
    };
  },
  computed: {
    ...mapState({
      showPlayer: (state) => state.musicPlayer.showPlayer,
    }),
    initialIndex() {
      let index = 0;
      index = this.tabLabels.findIndex((item) => {
        return item.label == this.selectedLabel;
      });
      console.log(index);
      return index;
    },
  },
  created() {
    let query = this.$route.query;
    this.resourceId = query.resourceId;
    this.title = decodeURIComponent(query.name);
    this.coverPic = query.picUrl;

    document.title = this.title;
    this.getDjDetail();
    this.getPrograms();
  },
  mounted() {
    // document.addEventListener("scroll", (event) => {
    //   let docEle = document.documentElement;
    //   let topBgEle = this.$refs.topBg;
    //   let topBarEle = this.$refs.topBar;
    //   let className = topBarEle.className;
    //   if (docEle) {
    //     if (docEle.scrollTop <= 170) {
    //       // 这段区域
    //       let borderRadius = Number(
    //         ((1 - docEle.scrollTop / 170) * 0.5 * 100).toFixed(1)
    //       );
    //       // console.log(borderRadius);
    //       topBgEle.style.borderRadius = `${borderRadius}%`;
    //       if (topBarEle.className.indexOf("black") != -1) {
    //         topBarEle.className = "top-bar";
    //       }
    //     } else {
    //       if (topBarEle.className.indexOf("black") == -1) {
    //         topBarEle.className = "top-bar black";
    //       }
    //     }
    //   }
    // });
  },
  methods: {
    scrollOutWrapper(pos) {
      console.log(pos);
    },
    changePage(current) {
      console.log(current);
      this.selectedLabel = this.tabLabels[current].label;
    },
    scroll(pos) {
      const x = Math.abs(pos.x);
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth;
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth;
      const deltaX = (x / slideScrollerWidth) * tabItemWidth;
      this.$refs.tabNav.setSliderTransform(deltaX);
    },
    goBack() {
      this.$router.back();
    },
    getPrograms() {
      this.pager.loading = true;
      api_getPrograms({
        rid: this.resourceId,
        limit: this.pager.limit,
        offset: (this.pager.page - 1) * this.pager.limit,
        asc: this.pager.asc,
      })
        .then((res) => {
          let { code, count, more, programs } = res.data;
          if (this.$utils.OK(code)) {
            if (this.pager.page === 1) {
              this.programs = programs;
            } else {
              this.programs = this.programs.concat(programs);
            }
            this.pager.total = count;
            this.pager.more = more;
            this.pager.page += 1;
          }
        })
        .catch((err) => {})
        .finally(() => {
          this.pager.loading = false;
        });
    },
    loadProgram() {
      if (this.pager.more == false) {
        return;
      }
      this.getPrograms();
    },
    getDjDetail() {
      api_getDjDetail({
        rid: this.resourceId,
      })
        .then((res) => {
          let { code, msg, data } = res.data;
          if (this.$utils.OK(code)) {
            this.djDetail = data;
          }
        })
        .catch((err) => {});
    },
    getSongUrl(id) {
      api_getSongUrl({
        id,
      }).then(res => {
        let { data, code } = res.data;
        if (this.$utils.OK(code)) {
          if (data.url) {
            this.$store.commit("musicPlayer/setMusicUrl", data.url);
          }
        }
      }).catch(err => {

      });
    },
    playMusic(id, name, pic) {
      console.log(id);
      if (!this.showPlayer) {
        this.$store.commit("musicPlayer/setShowPlayer", true);
      }
      this.getSongUrl(id);
      this.$store.commit('musicPlayer/setMusicPic', pic);
      this.$store.commit("musicPlayer/setMusicName", name);
      // this.$store.commit("musicPlayer/setShowPlayerControl", true);
    },
    start(event) {
      event.stopPropagation();
      // this.isMove = true;
      // this.startScrollLeft = this.$refs.musicWrapper.scrollLeft;
    },
    move(event) {
      event.stopPropagation();
      // let scrollLeft = this.$refs.musicWrapper.scrollLeft;
      // console.log(scrollLeft);
      // this.scrollLeft = scrollLeft;
    },
    end(event) {
      // this.isMove = false;
      // let offsetScrollLeft = this.scrollLeft - this.startScrollLeft;
      // console.log(offsetScrollLeft);
      // if (offsetScrollLeft >= 0 && offsetScrollLeft < 300) {
      //   this.marginLeft = '-375';
      // } else if (offsetScrollLeft < 0 && offsetScrollLeft >= -300) {
      //   this.marginLeft = '0';
      // }
    },
  },
};
</script>
 
<style lang = "less" scoped>
.page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  .top-bar {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 10px;
    position: fixed;
    top: 0;
    left: 0;
    color: #fff;
    z-index: 3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.black {
      color: #000;
      background-color: #fff;
      /* transition: all 0.25s ease-in; */
    }
    .top-bar-bg {
      width: 100%;
      height: 40px;
      position: absolute;
      left: 0;
      top: 0;
      background-repeat: no-repeat;
      background-size: cover;
      background-color: #fff;
      /* filter: blur(5px); */
    }
  }
  /deep/.cube-tab-bar {
    width: 140px;
    background-color: #fff;
    .cube-tab,
    .cube-tab_active {
      color: #000;
      z-index: 1;
      padding: 10px 0;
      font-size: 14px;
    }
    .cube-tab-bar-slider {
      height: 6px;
      border-radius: 3px;
      width: 35px !important;
      left: 17.5px;
      bottom: 8px;
      background-color: rgba(252, 150, 109, 0.7);
      background: linear-gradient(
        90deg,
        rgba(252, 150, 109, 1),
        rgba(252, 150, 109, 0.5)
      );
    }
  }
  .top {
    width: 100%;
    height: 200px;
    position: relative;
    overflow: hidden;
    .bg {
      width: 2000px;
      height: 1000px;
      border-radius: 50%;
      position: absolute;
      bottom: 30px;
      left: -812.5px;
      z-index: 2;
      overflow: hidden;
      .bg-img {
        width: 375px;
        height: 200px;
        position: absolute;
        left: 50%;
        bottom: -0;
        background-size: cover;
        background-position: center 30px;
        background-repeat: no-repeat;
        transform: translateX(-50%);
        filter: blur(5px);
      }
    }
    .top-bar {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      padding: 0 10px;
      position: fixed;
      top: 0;
      left: 0;
      color: #fff;
      z-index: 3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.black {
        color: #000;
        background-color: #fff;
        /* transition: all 0.25s ease-in; */
      }
      .top-bar-bg {
        width: 100%;
        height: 40px;
        position: absolute;
        left: 0;
        top: 0;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: #fff;
        /* filter: blur(5px); */
      }
    }
    .info {
      width: 320px;
      height: 90px;
      /* background-color: #fff; */
      position: absolute;
      left: 50%;
      top: 50px;
      transform: translateX(-50%);
      z-index: 2;
      border-radius: 10px;
      /* box-shadow: 0 0 8px 3px rgba(197, 197, 197, 0.2); */
      box-sizing: border-box;
      padding: 10px;
      display: flex;
      .cover {
        width: 70px;
        height: 70px;
        .cover-pic {
          width: 70px;
          height: 70px;
          border-radius: 4px;
          background-size: cover;
          background-position: center;
        }
      }
      .right {
        .name {
          font-size: 18px;
          margin-left: 10px;
          color: #fff;
        }
        .nickname {
          margin-top: 10px;
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-left: 10px;
          color: #fff;
          .avatar {
            width: 25px;
            height: 25px;
            border-radius: 12.5px;
            background-size: cover;
            margin-right: 10px;
          }
        }
      }
    }
    .bottom-bar {
      width: 100%;
      height: 40px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      .bottom-bar-control {
        width: 300px;
        height: 40px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10px;
        background-color: #fff;
        z-index: 2;
        border-radius: 20px;
        box-shadow: 0 0 8px 4px rgba(197, 197, 197, 0.2);
        display: flex;
        padding: 0 10px;
        .item {
          flex: 1;
          /* line-height: 40px; */
          display: flex;
          justify-content: center;
          align-items: center;
          i {
            font-size: 20px;
          }
          .number {
            /* width: 50px; */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 5px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .content {
    height: calc(100vh - 200px - 34px);
    /* overflow-y: auto; */
    .control-bar {
      width: 100%;
      height: 40px;
      background-color: #fff;
    }
    .music-wrapper {
      width: 375px;
      overflow-x: auto;
      .music-wrapper-content {
        display: flex;
        width: 750px;
        .music-list {
          padding: 20px;
          width: 375px;
          box-sizing: border-box;
          .music-item {
            display: flex;
            align-items: center;
            &:not(:first-of-type) {
              margin-top: 20px;
            }
            .pic {
              width: 60px;
              height: 60px;
              position: relative;
              .pic-img {
                width: 60px;
                height: 60px;
                border-radius: 8px;
              }
              .pic-bg {
                width: 50px;
                height: 50px;
                border-radius: 4px;
                background-color: #ccc;
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                z-index: -1;
              }
            }
            .right {
              margin-left: 12px;
              flex: 1;
              .title {
                width: 220px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .sub-title {
                display: flex;
                align-items: center;
                margin-top: 10px;
                font-size: 12px;
                color: #aaa;
                .duration,
                .play-count {
                  margin-left: 10px;
                  .icon {
                    margin-right: 3px;
                  }
                }
              }
            }
          }
        }
        .music-detail {
          width: 375px;
          background-color: red;
        }
      }
    }
    .music-list {
      padding: 20px;
      width: 375px;
      box-sizing: border-box;
      .music-item {
        display: flex;
        align-items: center;
        &:not(:first-of-type) {
          margin-top: 20px;
        }
        .pic {
          width: 60px;
          height: 60px;
          position: relative;
          .pic-img {
            width: 60px;
            height: 60px;
            border-radius: 8px;
          }
          .pic-bg {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            background-color: #ccc;
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            z-index: -1;
          }
        }
        .right {
          margin-left: 12px;
          flex: 1;
          .title {
            width: 220px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .sub-title {
            display: flex;
            align-items: center;
            margin-top: 10px;
            font-size: 12px;
            color: #aaa;
            .duration,
            .play-count {
              margin-left: 10px;
              .icon {
                margin-right: 3px;
              }
            }
          }
        }
      }
    }
    .music-detail {
      width: 375px;
      background-color: red;
    }
  }
}
</style>
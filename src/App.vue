<template>
  <div id="app">
    <router-view />
    <div
      :class="['player', flags ? 'flags' : '', showPlayerControl ? 'control' : '']"
      id="player"
      v-show="showPlayer"
      @click="handleTouchStart(true)"
    >
    <!-- 
      @mousedown="down"
      @mousemove="move"
      @mouseup="end"
      @touchstart="down"
      @touchmove="move"
      @touchend="end"
     -->
      <div class="cover">
        <van-icon v-if="showPlayerControl" class="cover-btn" :name="playIcon" size="30" @click.stop="handlePlay"/>
      </div>
      <div class="name">1111111111111111</div>
      <van-icon name="pause-circle-o" size="30"/>
      <van-icon name="cross" size="20" @click.stop="handleTouchStart(false)"/>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      deviceWidth: 0,
      flags: false, // 是否被拖拽
      position: {
        x: 0,
        y: 0,
      },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",

      playMusic: false,
      playIcon: 'play-circle-o',
    };
  },
  computed: {
    ...mapState({
      showPlayer: (state) => state.musicPlayer.showPlayer,
      showPlayerControl: (state) => state.musicPlayer.showPlayerControl,
    }),
  },
  methods: {
    handleTouchStart(flag) {
      this.$store.commit('musicPlayer/setShowPlayerControl', flag);
    },
    handlePlay() {
      this.playMusic = !this.playMusic;
      this.playIcon = this.playMusic ? 'pause-circle-o' : 'play-circle-o';
    },
    down(event) {
      this.flags = true;
      let touch;
      let player = document.getElementById("player");
      player.style.transition = '';
      console.dir(player);
      console.dir(event);
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = player.offsetLeft;
      this.dy = player.offsetTop;
    },
    move(event) {
      if (this.flags) {
        let touch;
        let player = document.getElementById("player");
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        player.style.left = this.xPum + "px";
        player.style.top = this.yPum + "px";
        //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        // document.addEventListener(
        //   "touchmove",
        //   function () {
        //     event.preventDefault();
        //   },
        //   false
        // );
      }
    },
    end(event) {
      let player = document.getElementById("player");
      // let center = this.deviceWidth / 2;
      // let xPum = this.xPum;
      player.style.transition = 'all 0.25s ease';
      // if (xPum <= center) {
      //   // left
      //   player.style.left = "0px";
      // } else {
      //   // right
      //   player.style.left = `${this.deviceWidth - 60}px`;
      // }
      player.style.left = `${this.deviceWidth - 65}px`;
      this.flags = false;
    },
  },
  mounted() {
    let app = document.getElementById("app");
    this.deviceWidth = app.clientWidth;
  },
};
</script>
<style lang="less">
@keyframes borderRadius {
  100% {
    border-radius: 30px;
  }
}
#app {
  width: 100%;
  min-height: 100vh;
  position: relative;
  .player {
    width: 200px;
    height: 60px;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    position: fixed;
    z-index: 1;
    box-shadow: 0 0 6px 4px rgba(197, 197, 197, 0.3);
    right: -170px;
    bottom: 50px;
    box-sizing: border-box;
    padding: 5px;
    padding-right: 10px;
    transition: all 0.5s ease-out;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.flags {
      // border-radius: 30px;
      animation: borderRadius 1s ease;
      animation-fill-mode: forwards;
    }
    &.control {
      right: 0px;
    }
    .cover {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      background-color: #aaa;
      position: relative;
      .cover-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
      }
    }
    .name {
      width: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

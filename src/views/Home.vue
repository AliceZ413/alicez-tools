<template>
  <div class="home">
    <van-grid>
      <van-grid-item
        v-for="(item, index) in menuList"
        :key="'menu_' + index"
        :icon="item.icon"
        :text="item.text"
        @click="clickItem(item.path)"
      ></van-grid-item>
    </van-grid>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      menuList: [
        {
          icon: 'gift-o',
          text: "转盘",
          path: '/layout/zhuanpan'
        },
        {
          icon: 'gift-o',
          text: "九宫格",
        },
        {
          icon: 'music-o',
          text: "听听歌",
          path: '/layout/music',
        },
      ],
    };
  },
  methods: {
    clickItem(path) {
      if (!path) {
        this.$toast('功能正在开发中，请期待~');
      } else {
        this.$router.push({
          path: path,
        });
      }
    },
  },
};
</script>

<template>
  <div class="music-wrapper">
    <div class="music-title">共 {{ records.length || 0 }} 个</div>
    <div class="music-list">
      <div
        class="music-list-item"
        v-for="item in records"
        :key="'record_' + item.resourceId"
        @click="toProgram(item.resourceId, item.name)"
      >
        <div class="pic">
          <img class="pic-img" :src="item.picUrl" alt="" />
          <div class="pic-bg"></div>
        </div>
        <div class="right">
          <div class="title">{{ item.name }}</div>
          <div class="sub-title">最近播放：</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Music",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      records: (state) => state.dj.resourceList,
    }),
  },
  methods: {
    toProgram(resourceId, name) {
      this.$router.push({
        path: '/program',
        query: {
          resourceId,
          name: encodeURIComponent(name),
        }
      });
    },
  },
};
</script>
 
<style lang = "less" scoped>
.music-wrapper {
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 0 10px 20px 10px;
  box-shadow: 0 0 2px 1px rgba(197, 197, 197, 0.3);
  .music-title {
    font-size: 14px;
    color: #aaa;
    line-height: 50px;
  }
  .music-list {
    .music-list-item {
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
          border-radius: 4px;
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
          font-weight: bold;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sub-title {
          margin-top: 5px;
          font-size: 14px;
          color: #aaa;
        }
      }
    }
  }
}
</style>
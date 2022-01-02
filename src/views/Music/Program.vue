<template>
  <div class="page">
    <van-nav-bar
      :title="title"
      :safe-area-inset-top="true"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    ></van-nav-bar>
    <div class="content">
      <div class="music-list">
        <van-list
          v-model="pager.loading"
          :finished="!pager.more"
          @load="loadProgram"
        >
          <div
            class="music-item"
            v-for="item in programs"
            :key="'record_' + item.id"
          >
            <div class="pic">
              <img class="pic-img" :src="item.coverUrl" alt="" />
            </div>
            <div class="right">
              <div class="title">{{ item.name }}</div>
              <div class="sub-title">
                <div class="time">{{ new Date(item.createTime).format("yyyy-MM-dd") }}</div>
                <div class="play-count">
                  <van-icon class="icon" name="play-circle-o" />{{ item.listenerCount }}
                </div>
                <div class="duration"><van-icon class="icon" name="clock-o" />{{ $utils.second2mmss(item.duration) }}</div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import { api_getPrograms } from "@/http/apis/music.js";
export default {
  data() {
    return {
      resourceId: "",
      title: "",
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
    };
  },
  created() {
    let query = this.$route.query;
    this.resourceId = query.resourceId;
    this.title = decodeURIComponent(query.name);

    document.title = this.title;
  },
  methods: {
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
      this.getPrograms();
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
  .content {
    flex: 1;
    overflow-y: auto;
    .music-list {
      padding: 20px;
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
            .duration, .play-count {
                margin-left: 10px;
                .icon {
                    margin-right: 3px;
                }
            }
          }
        }
      }
    }
  }
}
</style>
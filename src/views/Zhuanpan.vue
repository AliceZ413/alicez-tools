<template>
  <div class="canvas">
    <lucky-wheel
      class="lucky-wheel"
      ref="luckyWheel"
      width="360px"
      height="360px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      :default-config="{
        gutter: '0px',
        accelerationTime: timeLength / 2,
        decelerationTime: timeLength / 2,
      }"
      @start="startCallback"
      @end="endCallback"
    ></lucky-wheel>
    <van-button class="config-btn" block @click="showConfigPopup = true"
      >配置</van-button
    >
    <div class="alias-list">
      <div
        :class="['alias-item', activeIndex == index ? 'active' : '']"
        v-for="(item, index) in prizeForm.prizeList"
        :key="'alias_' + index"
      >
        {{ `${index} - ${item.text} 抽中 ${item.count} 次` }}
      </div>
    </div>

    <!-- 弹出层 -->
    <van-popup
      v-model="showConfigPopup"
      position="bottom"
      round
      style="height: 80%"
      :close-on-click-overlay="false"
    >
      <div class="config-content">
        <div class="title">简简单单做个配置</div>
        <div class="center">
          <div class="item">
            <div class="item-title">内容定制</div>
            <div class="item-content">
              <van-form>
                <van-field name="prizeNum" label="个数">
                  <template #input>
                    <van-stepper
                      v-model="prizeForm.prizeNum"
                      min="2"
                      max="20"
                      default-value="0"
                      @plus="changePrizeNum('plus')"
                      @minus="changePrizeNum('minus')"
                      @blur="changePrizeNum"
                    ></van-stepper>
                  </template>
                </van-field>
                <van-field label="每项配置">
                  <template #input>
                    <div class="">
                      <div
                        class="cell"
                        v-for="(item, index) in prizeForm.prizeList"
                        :key="item.key"
                      >
                        <van-icon name="clear" color="red" @click="removePrize(index)"/>
                        <div class="input">
                          编号
                          <div class="box">{{ index }}</div>
                        </div>
                        <div class="input">
                          别名
                          <div
                            :class="[
                              'input-box',
                              item.text.length == 0 ? 'empty' : '',
                            ]"
                          >
                            <input class="input-wrapper" v-model="item.text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </van-field>
              </van-form>
            </div>
          </div>
        </div>
        <div class="bottom">
          <van-row :gutter="10">
            <!-- <van-col :span="12">
              <van-button round block>取消</van-button>
            </van-col> -->
            <van-col :span="24">
              <van-button type="danger" round block @click="saveLocal"
                >保存</van-button
              >
            </van-col>
          </van-row>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { LuckyWheel } from "@lucky-canvas/vue";
import Ava from "../assets/images/Ava.png";
import Bella from "../assets/images/Bella.png";
import Carol from "../assets/images/Carol.png";
import Diana from "../assets/images/Diana.png";
import Eileen from "../assets/images/Eileen.png";
export default {
  name: "Zhuanpan",
  components: {
    LuckyWheel,
  },
  data() {
    return {
      showConfigPopup: false,
      blocks: [{ padding: "8px", background: "#fc966d" }],
      prizes: [
        {
          fonts: [
            {
              text: "0",
              top: "5%",
            },
          ],
          background: "#9bc9e1",
          imgs: [
            {
              src: Ava,
              width: "100px",
              height: "100px",
              top: "20%",
            },
          ],
        },
        {
          fonts: [
            {
              text: "1",
              top: "5%",
            },
          ],
          background: "#db7d73",
          imgs: [
            {
              src: Bella,
              width: "100px",
              height: "100px",
              top: "20%",
            },
          ],
        },
      ],
      buttons: [
        { radius: "40px", background: "#fed4be" },
        { radius: "35px", background: "#ffe6da" },
        {
          radius: "30px",
          background: "#fc966d",
          pointer: true,
          fonts: [{ text: "🤗", top: "-13px" }],
        },
      ],

      prizeForm: {
        prizeNum: 2, // 区域个数
        prizeList: [
          {
            index: 0,
            text: "叠",
            background: "#9bc9e1",
            count: 0, // 抽中次数
          },
          {
            index: 1,
            text: "老公",
            background: "#db7d73",
            count: 0, // 抽中次数
          },
        ],
      },

      bgColorList: [
        "#9bc9e1", // Ava
        "#db7d73", // Bella,
        "#b7a6da", // Carol
        "#e899af", // Diana
        "#576691", // Eileen
      ],
      bgImageList: [Ava, Bella, Carol, Diana, Eileen],
      isRotate: false,
      activeIndex: "",
      timeLength: 750,
      sacePrizeList: [],
    };
  },
  created() {
      let prizes = JSON.parse(window.localStorage.getItem('prizes'));
      let prizeList = JSON.parse(window.localStorage.getItem('prizeList'));
      if (prizes) {
          this.prizes = prizes;
      }
      if (prizeList) {
          prizeList.forEach(item => {
              item.count = 0;
          });
          this.prizeForm.prizeList = prizeList;
          this.prizeForm.prizeNum = prizeList.length;
      }
  },
  methods: {
    rnd(seed) {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280.0;
    },
    rand(number) {
      let today = new Date();
      let seed = today.getTime();
      let result = Math.ceil(this.rnd(seed) * number);
      console.log(result);
      if (this.activeIndex == result) {
        return this.rand(this.prizeForm.prizeNum - 1);
      }
      return result;
    },
    // 获取[n,m]随机数
    getRandomNum(m, n = 0) {
        let result = parseInt(Math.random() * (m - n + 1) + n);
        if (this.activeIndex == result) {
            return this.getRandomNum(m, n);
        }
        return result;
    },
    // 点击抽奖按钮会触发star回调
    startCallback() {
      // 调用抽奖组件的play方法开始游戏
      this.$refs.luckyWheel.play();
      console.log(this.$refs.luckyWheel);
      this.isRotate = true;
      // 模拟调用接口异步抽奖
      setTimeout(() => {
        // 假设后端返回的中奖索引是0
        let result = this.getRandomNum(this.prizeForm.prizeNum - 1);
        // 调用stop停止旋转并传递中奖索引
        this.$refs.luckyWheel.stop(result);

        this.activeIndex = result;
        this.prizeForm.prizeList[result].count += 1;
      }, this.timeLength);
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
    //   console.log(prize);
      this.isRotate = false;
    },
    changePrizeNum(type) {
      let oldNum = this.prizeForm.prizeNum;
      if (type == "plus") {
        this.prizeForm.prizeNum++;
      } else if (type == "minus") {
        this.prizeForm.prizeNum--;
      }
      if (this.prizeForm.prizeNum == 0 || this.prizeForm.prizeNum == 1) {
        this.prizeForm.prizeNum = oldNum;
        return;
      }
      let length = this.prizeForm.prizeNum;
      let prizeList = [];
      let bgColorList = this.bgColorList;
      let oldPrizeList = this.prizeForm.prizeList;
      for (let i = 0; i < length; i++) {
        let config = {
          background: bgColorList[i % 5],
          text: i < oldPrizeList.length ? oldPrizeList[i].text : "",
          index: i,
          key: `${i}-${this.getRandomNum(100, 0)}-${this.getRandomNum(100, 0)}`,
          imgs: this.bgImageList[i % 5],
          count: i < oldPrizeList.length ? oldPrizeList[i].count : 0,
        };
        prizeList.push(config);
      }
      this.prizeForm.prizeList = prizeList;
      this.saveConfig();

    },
    // 保存配置
    saveConfig() {
      let prizes = [];
      for (let i = 0; i < this.prizeForm.prizeNum; i++) {
        prizes.push({
          fonts: [
            {
              text: this.prizeForm.prizeList[i].index,
              top: "5%",
              fontSize: "12px",
              fontColor: "#fff",
            },
          ],
          background: this.prizeForm.prizeList[i].background,
          imgs: [
            {
              src: this.prizeForm.prizeList[i].imgs,
              width: "100px",
              height: "100px",
              top: "20%",
            },
          ],
        });
      }
      console.log(this.prizeForm.prizeList);
      this.prizes = prizes;
    //   window.localStorage.setItem('prizes', JSON.stringify(this.prizes));
    //   window.localStorage.setItem('prizeList', JSON.stringify(this.prizeForm.prizeList));
    },
    // 本地保存
    saveLocal() {
        console.log(this.prizeForm.prizeList);
        window.localStorage.setItem('prizes', JSON.stringify(this.prizes));
        window.localStorage.setItem('prizeList', JSON.stringify(this.prizeForm.prizeList));
        this.showConfigPopup = false;
    },
    // 删除
    removePrize(index) {
        this.prizes.splice(index, 1);
        this.prizeForm.prizeList.splice(index, 1);
        this.prizeForm.prizeNum = this.prizeForm.prizeList.length;
        
    },
  },
};
</script>
 
<style lang = "less" scoped>
.canvas {
  width: 100%;
  .lucky-wheel {
    margin: 0 auto;
  }
  .config-btn {
    margin-top: 30px;
  }

  .alias-list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .alias-item {
      width: 50%;
      line-height: 30px;
      &.active {
        color: red;
        animation: flash 1s ease;
      }
    }
  }
  @keyframes flash {
    0% {
      color: #000;
    }
    25% {
      color: red;
    }
    50% {
      color: #000;
    }
    75% {
      color: red;
    }
    100% {
      color: #000;
    }
  }

  .config-content {
    padding: 10px;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      padding: 5px 0;
    }
    .center {
      flex: 1;
      overflow-y: auto;
      .cell {
        display: flex;
        align-items: center;
        &:not(:first-of-type) {
          margin-top: 10px;
        }
        .input {
          display: flex;
          align-items: center;
          margin-left: 10px;
          /* &:not(:first-of-type) {
            margin-left: 10px;
          } */
          .input-box {
            width: 75px;
            box-sizing: border-box;
            padding: 0 5px;
            text-align: left !important;
            &.empty {
              /* width: 24px; */
            }
            .input-wrapper {
              width: 100%;
              border: none;
              background: transparent;
            }
          }
          .box {
            width: 24px;
          }
          .box,
          .input-box {
            height: 24px;
            text-align: center;
            line-height: 24px;
            background-color: #f2f3f5;
            margin-left: 5px;
          }
        }
      }
    }
    .bottom {
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
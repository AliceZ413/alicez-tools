<template>
    <div class="page">
        <van-nav-bar :title="navBarTitle" :safe-area-inset-top="true" left-text="返回" left-arrow @click-left="goBack"></van-nav-bar>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            showLeftArrow: false,
        }
    },
    computed: {
        navBarTitle() {
            return this.$route.meta.title;
        },
        routerList() {
            return this.$route.matched;
        },
    },
    watch: {
        // routerList: {
        //     handler(newVal) {
        //         if (newVal.length > 1) {
        //             this.showLeftArrow = true;
        //         } else {
        //             this.showLeftArrow = false;
        //         }
        //     },
        //     deep: true,
        // }
    },
    methods: {
        goBack() {
            this.$router.back();
        }
    },
}
</script>
 
<style lang = "less" scoped>
    .page {
        width: 100%;
        min-height: 100vh;
        box-sizing: border-box;
        .content {
            padding: 10px 10px;
        }
    }
</style>
<template>
    <div class="page">
        <van-nav-bar :title="navBarTitle" :safe-area-inset-top="true"></van-nav-bar>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    computed: {
        navBarTitle() {
            return this.$route.meta.title;
        },
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
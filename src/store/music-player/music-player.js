// 电台 - 播客
module.exports = {
    namespaced: true, // 为了解决不同模块命名冲突的问题
    state: () => ({
        //保存页面元素滚动位置，格式：scrollId: {x: 0, y: 0}
        showPlayer: false, // 显示player
        showPlayerControl: false, // 显示player的控制器
        
    }),
    mutations: {
        setShowPlayer(state, value) {
            // 这里的 `state` 对象是模块的局部状态
            state.showPlayer = value;
        },
        setShowPlayerControl(state, value) {
            state.showPlayerControl = value;
        },
    },
    actions: {
        
    },
}
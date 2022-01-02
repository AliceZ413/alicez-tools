// 电台 - 播客
module.exports = {
    namespaced: true, // 为了解决不同模块命名冲突的问题
    state: () => ({
        //保存页面元素滚动位置，格式：scrollId: {x: 0, y: 0}
        resourceList: [{
            resourceId: '959453342',
            name: '乃琳翻唱合集',
            picUrl: 'http://p2.music.126.net/jBBJp20lYbZKqSBgLkg0oA==/109951165773493066.jpg',
            lastProgramId: '2487671061'
        }, {
            resourceId: '959471867',
            name: '珈乐翻唱合集',
            picUrl: 'http://p2.music.126.net/o6zwD1WTzQJTiVMMGKkFqA==/109951165775220810.jpg',
            lastProgramId: '2492454526'
        }],
    }),
    mutations: {
        setResourceList(state, value) {
            // 这里的 `state` 对象是模块的局部状态
            state.resourceList = value;
        }
    },
    getters: {
        resourceList(state) {
            return state.resourceList;
        }
    }
}
const utils = {
    OK(code) {
        return code == 200;
    },
    // 秒转mm:ss格式
    second2mmss(second) {
        var minutes = parseInt((second % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((second % (1000 * 60)) / 1000);
        return `${minutes}:${seconds}`;
    },
};

export default utils;
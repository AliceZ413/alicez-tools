const utils = {
    OK(code) {
        return code == 200;
    },
    // 秒转mm:ss格式
    second2mmss(second) {
        var minutes = parseInt((second % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((second % (1000 * 60)) / 1000);
        return `${minutes}:${seconds >= 10 ? seconds : '0'+seconds}`;
    },
    // 播放数转换
    playCountChange(count) {
        if (count < 10000) {
            return count;
        } else {
            let w = (count / 10000).toFixed(1);
            return `${w}万`;
        }
    },
};

export default utils;
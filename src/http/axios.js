/**
 * axios封装
 * 
 */
import axios from 'axios';
import qs from 'qs';
let request = axios.create({
    timeout: 30000,
});

// 请求拦截器
request.interceptors.request.use(config => {
    try {
        if (
            config.method.toLowerCase() === "post" &&
            config.headers.post["Content-Type"].indexOf("x-www-form-urlencoded") >=
            0 &&
            !(config.data instanceof FormData)
        ) {
            config.data = qs.stringify(config.data);
        }
        return config;
    } catch (err) {

    }
});

//响应拦截器
request.interceptors.response.use(
    function (response) {
        // console.log("接口访问结果：", response);
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

let http = {
    get(url, data) {
        let params = data;
        if (data && data.params) {
            params = data.params;
        }
        return params ? request.get(url, {
            params
        }) : request.get(url);
    },
    post(url, data, format = 'application/x-www-form-urlencoded;charset=UTF-8', options = {}) {
        request.defaults.headers.post['Content-Type'] = format;

        return request.post(url, data, options);
    },
};

export default http;
import http from '@/http/axios';
import config from '@/http/config';

export const api_getPrograms = function (data) {
    return http.get(`${config.domain}/dj/program`, data);
};

export const api_getDjDetail = function (data) {
    return http.get(`${config.domain}/dj/detail`, data);
};

export const api_getSongUrl = function(data) {
    return http.get(`${config.domain}/song/download/url`, data);
}

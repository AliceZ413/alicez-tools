import http from '@/http/axios';
import config from '@/http/config';

export const api_getPrograms = function (data) {
    return http.get(`${config.domain}/dj/program`, data);
};
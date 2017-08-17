import axios from 'axios';
import queryString from 'qs';
import _ from 'lodash';
import config from './config'

let base = '';

let instance = axios.create({
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
});

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export default {
    get: (url, params) => {

        url = config.baseUrl + url;
        if (params) {
            url += '?' + queryString.stringify(params);
        }
        return instance.get(url)
            .then(res => {
                if (res.data.code == 2 || res.data.code == 3) {
                    localStorage.clear();
                    location.reload();
                    return;
                }
                return res.data
            })
            .catch(err => {
                console.log(err);
            })
    },
    post: (url, body, option) => {
        url = config.baseUrl + url;
        body = queryString.stringify(body || {})
        let options = _.assign({}, config.header, option || {});
        return instance.post(url, body, options)
            .then((res) => {
                if (res.data.code == 2 || res.data.code == 3) {
                    localStorage.clear();
                    location.reload();
                    return;
                }
                return res.data
            })
            .catch(err => {
                console.log(err);
            })
    },
    //并发
    all: (arr) => {
        return axios.all(arr)
        //             .then(axios.spread(function (acct, perms) {
        //     // 两个请求现在都执行完成
        //   }));
    }


}
import axios, { AxiosResponse } from 'axios'

import Log from "../utils/log";
import { getConfig } from "../utils";

const config: any = getConfig() || {}
const host = '127.0.0.1'
const port = '8080'

const instance = axios.create({
  baseURL: `http://${config.host || host}:${config.port || port}`,
  timeout: 10000
});

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  Log.Error('处理消息失败')
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default instance

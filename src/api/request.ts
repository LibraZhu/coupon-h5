import { useAppStore } from "@/store/modules/app";
import axios, { CreateAxiosDefaults } from "axios";
import { showToast } from "vant";

const service = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://springboot-q6l6-14929-5-1314654459.sh.run.tcloudbase.com"
    : "http://172.16.4.177",
  timeout: 15000, // request timeout
} as CreateAxiosDefaults);

service.interceptors.request.use(
  config => {
    // do something before request is sent
    const appStore = useAppStore();
    config.headers["uid"] = appStore.uid;
    return config;
  },
  error => {
    // do something with request error
    console.log(error);
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    if (!res) {
      return res;
    }
    if (!res.code) {
      return res;
    }

    if (res.code !== 200) {
      showToast(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log(error);
    if (error.response && error.response.data) {
      showToast(error.response.data.message || "Error");
    } else {
      if (error.message === "Network Error") {
        showToast("服务器异常，请稍后再试");
      } else {
        showToast(error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default service;

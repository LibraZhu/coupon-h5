import { defineStore } from "pinia";
export const useAppStore = defineStore("app", {
  state: (): {
    uid?: string;
    cloud?: any;
  } => ({
    uid: "",
  }),
  actions: {
    setUid(uid?: string) {
      this.uid = uid;
    },
    async callCloud(
      url: string,
      method: "GET" | "POST",
      data: any,
      number = 0
    ) {
      if (this.cloud === null || this.cloud == undefined) {
        this.cloud = new wx.cloud.Cloud({
          identityless: true,
          resourceAppid: "wxe8a645fdd37e0005",
          resourceEnv: "prod-2glx9khga5692d1f",
        });
        await this.cloud.init(); // init过程是异步的，需要等待init完成才可以发起调用
      }
      try {
        const result = await this.cloud.callContainer({
          path: url,
          method: method,
          header: {
            "X-WX-SERVICE": "springboot-q6l6",
            "content-type": "application/json",
            uid: this.uid ?? "",
          },
          data,
        });
        return result.data; // 业务数据在data中
      } catch (e: any) {
        const error = e.toString();
        // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
        if (error.indexOf("Cloud API isn't enabled") != -1 && number < 3) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(this.callCloud(url, method, data, number + 1));
            }, 300);
          });
        } else {
          throw new Error(`服务器异常${error}`);
        }
      }
    },
  },
});

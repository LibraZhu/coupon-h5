import { defineStore } from "pinia";
export const useAppStore = defineStore("app", {
  state: (): {
    uid?: string;
    gOpenid?: string;
  } => ({
    uid: "",
    gOpenid: "",
  }),
  actions: {
    setUid(uid?: string) {
      this.uid = uid;
    },
    setGOpenid(gOpenid?: string) {
      this.gOpenid = gOpenid;
    },
  },
});

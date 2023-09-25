import { useAppStore } from "@/store";
import { useRoute } from "vue-router";

export const useOpenid = () => {
  const route = useRoute();
  const appStore = useAppStore();
  appStore.setGOpenid(route.query.gOpenid?.toString() ?? "");
  appStore.setUid(route.query.uid?.toString() ?? "");
};

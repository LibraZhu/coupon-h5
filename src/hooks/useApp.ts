import { useAppStore } from "@/store";
import { useRoute } from "vue-router";

export const useApp = () => {
  const route = useRoute();
  const appStore = useAppStore();
  appStore.setUid(route.query.uid?.toString() ?? "");
};

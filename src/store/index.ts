import { useAppStore } from "@/store/modules/app";
import { createPinia } from "pinia";

const pinia = createPinia();

export { useAppStore };
export default pinia;

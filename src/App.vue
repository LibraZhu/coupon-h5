<template>
  <div class="flex-column full-height">
    <!-- <VanNavBar
      v-if="!route.meta.noNavBar"
      :title="route.meta.title?.toString() ?? ''"
      left-arrow
      :border="route.meta.navBarColor === undefined"
      :style="{ 'background-color': route.meta.navBarColor ?? 'white' }"
      @click-left="onBackClick"
    /> -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="cacheViews">
        <component :is="Component" :key="route.path ?? ''" />
      </keep-alive>
    </router-view>
    <VanTabbar
      v-if="route.meta.tabbar"
      v-model="tabIndex"
      active-color="#ee0a24"
    >
      <VanTabbarItem
        v-if="scrollTop && tabIndex === 'home'"
        name="home"
        to="/home"
        @click="backTop"
      >
        <span>回顶部</span>
        <template #icon="props">
          <img :src="props.active ? topIcon[1] : topIcon[0]" />
        </template>
      </VanTabbarItem>
      <VanTabbarItem v-else name="home" to="/home" icon="home-o"
        >首页</VanTabbarItem
      >
      <VanTabbarItem name="search" to="/search" icon="search"
        >查返利</VanTabbarItem
      >
      <VanTabbarItem name="mine" to="/mine" icon="friends-o"
        >我的</VanTabbarItem
      >
    </VanTabbar>
  </div>
</template>
<script lang="ts" setup>
import EventBus from "@/bus";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useImage } from "./hooks/useImage";

function onBridgeReady() {
  WeixinJSBridge.call("hideOptionMenu");
}
if (typeof WeixinJSBridge == "undefined") {
  if (document.addEventListener) {
    document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
  } else if (document.attachEvent) {
    document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
    document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
  }
} else {
  onBridgeReady();
}
const cacheViews = ref<string[]>([]);
const route = useRoute();
const router = useRouter();
const { assets } = useImage();
watch(route, r => {
  if (!r.meta.noCache && r.name) {
    // 如果之前缓存，删除前面的页面，然后推入栈顶；如果之前没有直接放入栈顶
    const index = cacheViews.value.indexOf(r.name?.toString() ?? "");
    if (index !== -1) {
      cacheViews.value.splice(0, index);
    } else {
      cacheViews.value.unshift(r.name?.toString());
    }
  }
  if (r.name === "Home") {
    tabIndex.value = "home";
    cacheViews.value = cacheViews.value.filter(item => item === "Home");
  }
  if (r.name === "Mine") {
    tabIndex.value = "mine";
    cacheViews.value = cacheViews.value.filter(
      item => item === "Home" || item === "Mine"
    );
  }
  if (r.name === "Search") {
    tabIndex.value = "search";
  }
});
const onBackClick = () => {
  router.back();
};
//

const scrollTop = ref(false);
const tabIndex = ref("home");
const topIcon = [assets("top_inactive.png"), assets("top_active.png")];
const setScrollTop = (val: any) => {
  scrollTop.value = val;
};
const backTop = () => {
  EventBus.emit("backTop");
};
onMounted(() => {
  EventBus.on("scrollTop", setScrollTop);
});
onBeforeUnmount(() => {
  EventBus.off("scrollTop", setScrollTop);
});
</script>
<style></style>

<template>
  <div class="full-height" :style="{ 'background-color': navbarBackground }">
    <div class="navbar">
      <van-tabs
        v-model:active="tabIndex"
        @change="onChangeTab"
        :ellipsis="false"
        line-width="20"
        :background="navbarBackground"
        color="#fff"
        title-active-color="#fff"
        title-inactive-color="rgba(255,255,255,0.7)"
        style="display: inline-block"
      >
        <van-tab title="滴滴" :name="0"></van-tab>
        <van-tab title="T3" :name="1"></van-tab>
        <van-tab title="花小猪" :name="2"></van-tab>
      </van-tabs>
    </div>
    <div class="page-container flex-column pb-10">
      <van-image class="didi-image" :src="banner"></van-image>
      <div class="didi-content">
        <div class="didi-step flex">
          <div class="flexable flex-column flex-center">
            <div class="didi-step-item">
              <van-image width="30" :src="assets('wm_1.png')"></van-image>
            </div>
            <text class="pt-10">先领券</text>
          </div>
          <text class="didi-step-arrow"></text>
          <div class="flexable flex-center flex-column">
            <div class="didi-step-item">
              <van-image width="30" :src="assets('wm_4.png')"></van-image>
            </div>
            <text class="pt-10">再打车</text>
          </div>
          <text class="didi-step-arrow"></text>
          <div class="flexable flex-column flex-center">
            <div class="didi-step-item">
              <van-image width="30" :src="assets('wm_3.png')"></van-image>
            </div>
            <text class="pt-10">享优惠</text>
          </div>
        </div>
        <div>
          <div class="flex">
            <div
              class="didi-content-divider-left"
              :style="{ 'background-color': navbarBackground }"
            ></div>
            <div class="didi-content-divider"></div>
            <div
              class="didi-content-divider-right"
              :style="{ 'background-color': navbarBackground }"
            ></div>
          </div>
        </div>
        <div style="text-align: center">
          <van-image style="width: 50%" :src="miniCode"></van-image>
        </div>
        <div style="text-align: center; color: #888; font-size: 14px">
          长按或扫描查看
        </div>
        <van-button round color="#ff824d" class="didi-btn" @click="onLinkClick">
          领券打车
        </van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { unionLink } from "@/api";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import { closeToast, showLoadingToast } from "vant";
import { onMounted, ref } from "vue";

useApp();
const { assets } = useImage();
const tabIndex = ref(0);
const navbarBackground = ref("#ec5b26");
const miniCode = ref("");
const banner = ref(
  "https://img.jutuike.com/taokeout/banner/didi_2023_banner.png?v=1"
);
const dd = ref<Record<string, any>>({});
const tt = ref<Record<string, any>>({});
const pig = ref<Record<string, any>>({});
const onChangeTab = () => {
  if (tabIndex.value === 0) {
    navbarBackground.value = "#ff6931";
    banner.value =
      "https://img.jutuike.com/taokeout/banner/didi_2023_banner.png?v=1";
  } else if (tabIndex.value === 1) {
    navbarBackground.value = "#ec5b26";
    banner.value =
      "https://img.jutuike.com/taokeout/banner/t3go_banner.png?v=1";
  } else if (tabIndex.value === 2) {
    navbarBackground.value = "#b617b9";
    banner.value =
      "https://img.jutuike.com/taokeout/banner/jtk_hxz_banner.png?v=1";
  }
  getUnionLink();
};
const getUnionLink = () => {
  if (tabIndex.value === 0 && dd.value.miniCode) {
    miniCode.value = dd.value.miniCode;
    return;
  } else if (tabIndex.value === 1 && tt.value) {
    miniCode.value = tt.value.miniCode.miniCode;
    return;
  } else if (tabIndex.value === 2 && pig.value) {
    miniCode.value = pig.value.miniCode.miniCode;
    return;
  }
  showLoadingToast({ message: "加载中", duration: 0 });
  unionLink(tabIndex.value).then((res: any) => {
    closeToast();
    if (tabIndex.value === 0) {
      miniCode.value = res.data.we_app_info.miniCode;
      dd.value = { miniCode: res.data.we_app_info.miniCode, h5: res.data.h5 };
    } else if (tabIndex.value === 1) {
      miniCode.value = res.data.we_app_info.miniCode;
      tt.value = { miniCode: res.data.we_app_info.miniCode, h5: res.data.h5 };
    } else if (tabIndex.value === 2) {
      miniCode.value = res.data.we_app_info.miniCode;
      pig.value = { miniCode: res.data.we_app_info.miniCode, h5: res.data.h5 };
    }
  });
};
const onLinkClick = () => {
  if (tabIndex.value === 0 && dd.value) {
    window.open(dd.value.h5);
  } else if (tabIndex.value === 1 && tt.value) {
    window.open(tt.value.h5);
  } else if (tabIndex.value === 2 && pig.value) {
    window.open(pig.value.h5);
  }
};
onMounted(() => {
  getUnionLink();
});
</script>
<style lang="scss" scoped>
.navbar {
  height: 46px;
  position: relative;
  text-align: center;
}

.navbar-back {
  width: 46px;
  line-height: 46px;
  position: absolute;
  left: 0;
}

.navbar-tab {
  display: inline-flex;
}

.navbar-tab .van-tabs__scroll {
  background-color: transparent;
}

.didi-image {
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.didi-content {
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin: 0px 20px;
  position: relative;
  padding-bottom: 30px;
}

.didi-step {
  margin: 20px;
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.didi-step-item {
  width: 60px;
  height: 60px;
  border-radius: 100px;
  background-color: #ff824d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.didi-step-item image {
  width: 30px;
  height: 30px;
}

.didi-step-arrow {
  border: solid #ff824d;
  display: inline-block;
  border-width: 0px 1px 1px 0px;
  padding: 2px 10px 2px 10px;
  margin-right: 2px;
  margin-bottom: 26px;
  transform: skewX(50deg) translateY(-2px);
}

.didi-content-divider {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed #ff824d;
}

.didi-content-divider-left {
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background-color: #ff824d;
  margin-left: -12px;
}

.didi-content-divider-right {
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background-color: #ff824d;
  margin-right: -12px;
}

.didi-btn {
  width: calc(100% - 80px);
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 16px;
  color: white;
  font-size: 18px;
}
</style>

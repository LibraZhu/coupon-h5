<template>
  <div
    class="page-container flex-column pb-10"
    style="background-color: #ffe262"
  >
    <img
      class="mt-image"
      src="http://p1.meituan.net/marketingcpsmedia/83fe198782835ab456534e1b5cbaabf6178757.jpg"
    />
    <div class="mt-content">
      <div class="mt-step flex">
        <div class="flexable flex-column flex-center">
          <div class="mt-step-item">
            <img style="width: 30px" :src="assets('wm_1.png')" />
          </div>
          <text class="pt-10">领红包</text>
        </div>
        <text class="mt-step-arrow"></text>
        <div class="flexable flex-center flex-column">
          <div class="mt-step-item">
            <img style="width: 30px" width="30" :src="assets('wm_2.png')" />
          </div>
          <text class="pt-10">再下单</text>
        </div>
        <text class="mt-step-arrow"></text>
        <div class="flexable flex-column flex-center">
          <div class="mt-step-item">
            <img style="width: 30px" width="30" :src="assets('wm_3.png')" />
          </div>
          <text class="pt-10">享优惠</text>
        </div>
      </div>
      <div>
        <div class="flex">
          <div class="mt-content-divider-left"></div>
          <div class="mt-content-divider"></div>
          <div class="mt-content-divider-right"></div>
        </div>
      </div>
      <VanButton
        color="#ffe262"
        class="mt-btn"
        @click="onLinkClick('meituan_link_1')"
      >
        先领外卖大红包
      </VanButton>
      <VanButton
        color="#ffe262"
        plain
        class="mt-btn"
        @click="onLinkClick('meituan_link_2')"
      >
        再领品质红包
      </VanButton>
      <VanButton
        color="#ffe262"
        plain
        class="mt-btn"
        @click="onLinkClick('meituan_link_3')"
      >
        大牌奶茶/汉堡3折起
      </VanButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { meituan } from "@/api";
import { SysConfig } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import { closeToast, showLoadingToast } from "vant";
import { onMounted } from "vue";

useApp();
const { assets } = useImage();
let linkList: SysConfig[] = [];
const onLinkClick = (code: string) => {
  const link = linkList.find(item => item.cCode === code);
  if (link) {
    window.open(link.cValue);
  }
};
onMounted(() => {
  showLoadingToast({ message: "加载中", duration: 0 });
  meituan().then((res: any) => {
    closeToast();
    linkList = res.data ?? [];
  });
});
</script>
<style lang="scss" scoped>
.mt-image {
  width: calc(100% - 40px);
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 30px;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.mt-content {
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin: 0px 20px;
  position: relative;
  padding-bottom: 30px;
}

.mt-step {
  margin: 20px;
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.mt-step-item {
  width: 60px;
  height: 60px;
  border-radius: 100px;
  background-color: #ffe262;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mt-step-item image {
  width: 30px;
  height: 30px;
}

.mt-step-arrow {
  border: solid #ffe262;
  display: inline-block;
  border-width: 0px 1px 1px 0px;
  padding: 2px 10px 2px 10px;
  margin-right: 2px;
  margin-bottom: 26px;
  transform: skewX(50deg) translateY(-2px);
}

.mt-content-divider {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed #ffe262;
}

.mt-content-divider-left {
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background-color: #ffe262;
  margin-left: -12px;
}

.mt-content-divider-right {
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background-color: #ffe262;
  margin-right: -12px;
}

.mt-btn {
  width: calc(100% - 80px);
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 16px;
}
:deep() {
  .van-button--normal {
    font-size: 18px;
    font-weight: 700;
  }
}
</style>

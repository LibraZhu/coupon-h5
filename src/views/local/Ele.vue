<template>
  <div
    class="page-container flex-column pb-10"
    style="background-color: #3590f1"
  >
    <img
      class="mt-image"
      src="https://img.jutuike.com/taokeout/banner/ele_hongbao_banner.png"
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
            <img style="width: 30px" :src="assets('wm_2.png')" />
          </div>
          <text class="pt-10">再下单</text>
        </div>
        <text class="mt-step-arrow"></text>
        <div class="flexable flex-column flex-center">
          <div class="mt-step-item">
            <img style="width: 30px" :src="assets('wm_3.png')" />
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
        color="#3590f1"
        class="mt-btn"
        @click="onLinkClick('ele_link_1')"
      >
        先领暴涨大红包
      </VanButton>
      <VanButton
        color="#3590f1"
        plain
        class="mt-btn"
        @click="onLinkClick('ele_link_2')"
      >
        必中8元红包【部分城市】
      </VanButton>
      <VanButton
        color="#3590f1"
        plain
        class="mt-btn"
        @click="onLinkClick('ele_link_3')"
      >
        抢8~18元红包
      </VanButton>
      <VanButton
        color="#3590f1"
        plain
        class="mt-btn"
        @click="onLinkClick('ele_link_4')"
      >
        最新翻倍红包
      </VanButton>
    </div>
  </div>
  <van-dialog
    v-model:show="dialogInfo.visible"
    width="240"
    :showConfirmButton="false"
    closeOnClickOverlay
  >
    <van-image width="240" :src="assets(`${dialogInfo.imageCode}.jpg`)" />
  </van-dialog>
</template>
<script lang="ts" setup>
import { ele } from "@/api";
import { SysConfig } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import Clipboard from "clipboard";
import { closeToast, showLoadingToast, showToast } from "vant";
import { onMounted, reactive } from "vue";

useApp();
const { assets } = useImage();
const dialogInfo = reactive({
  visible: false,
  imageCode: "",
});
let linkList: SysConfig[] = [];
const onLinkClick = (code: string) => {
  if (code === "ele_link_1" || code === "ele_link_2" || code === "ele_link_3") {
    dialogInfo.imageCode = code;
    dialogInfo.visible = true;
    return;
  }
  const link = linkList.find(item => item.cCode === code);
  if (link) {
    // window.open(link.cValue);
    copy(link.cValue, "口令复制成功，请打开饿了么App领取");
  }
};
onMounted(() => {
  showLoadingToast({ message: "加载中", duration: 0 });
  ele().then((res: any) => {
    closeToast();
    linkList = res.data ?? [];
  });
});

const copy = async (data: string, message: string) => {
  const fakeEl = document.createElement("button");
  const clipboard = new Clipboard(fakeEl, {
    text: () => data,
    action: () => "copy",
    container: document.body,
  });
  clipboard.on("success", e => {
    clipboard.destroy();
  });
  clipboard.on("error", e => {
    clipboard.destroy();
  });
  setTimeout(() => {
    fakeEl.click();
    showToast(message);
  }, 200);
};
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
  background-color: #3590f1;
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
  border: solid #3590f1;
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
  border-bottom: 1px dashed #3590f1;
}

.mt-content-divider-left {
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background-color: #3590f1;
  margin-left: -12px;
}

.mt-content-divider-right {
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background-color: #3590f1;
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

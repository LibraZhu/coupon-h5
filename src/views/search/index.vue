<template>
  <div class="search-container">
    <div class="search-title flex">
      <van-image width="20" height="20" :src="assets('copy.png')" />
      <span>复制商品链接</span>
      <span class="search-arrow"></span>
      <van-image size="20" :src="assets('miniprogram.png')" />
      <span>打开公众号</span>
      <span class="search-arrow"></span>
      <van-image width="20" height="20" :src="assets('discount.png')" />
      <span>搜券查优惠</span>
    </div>
    <div class="search-textarea">
      <van-field
        type="textarea"
        :border="false"
        :autosize="{ maxHeight: 150, minHeight: 150 }"
        v-model="searchKey"
        placeholder="搜索商品链接/标题/关键字（长按粘贴）"
      ></van-field>
      <div class="search-textarea-clear" @click="onClearSearch">
        <van-icon name="delete-o" />清空搜索
      </div>
    </div>
  </div>
  <div class="flex p-16">
    <van-button class="search-btn-right" @click="onSearchClick"
      >一键搜索</van-button
    >
  </div>
</template>
<script lang="ts" setup>
import { searchProductByLink } from "@/api";
import { SourceEnum } from "@/enum";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import { Base64 } from "js-base64";
import { closeToast, showLoadingToast, showToast } from "vant";
import { ref } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "Search",
});
useApp();
const { assets } = useImage();
const router = useRouter();
const searchKey = ref("");
const onClearSearch = () => {
  searchKey.value = "";
};
const onSearchClick = () => {
  if (searchKey.value.length === 0) {
    return;
  }

  if (searchKey.value.indexOf("http") !== -1) {
    showLoadingToast({ message: "搜索中", duration: 0 });
    searchProductByLink(searchKey.value).then((res: any) => {
      closeToast();
      const productList = res.data ?? [];
      if (productList.length === 0) {
        showToast("没有找到商品");
      } else if (productList.length === 1) {
        const product = productList[0];
        if (
          product.source == SourceEnum.JD ||
          product.source == SourceEnum.TB ||
          product.source == SourceEnum.WPH
        ) {
          router.push({
            name: "ProductDetail",
            query: {
              data: Base64.encode(JSON.stringify(product)),
              type: product.source,
            },
          });
        } else {
          router.push({
            name: "ProductDetail",
            query: {
              id: product.goods_id,
              sid: product.searchId,
              type: product.source,
              data: Base64.encode(JSON.stringify(product)),
            },
          });
        }
      } else {
        const product = productList[0];
        router.push({
          name: "SearchList",
          query: {
            type: product.source,
            keyword: product.goods_name,
          },
        });
      }
    });
  } else {
    router.push({
      name: "SearchList",
      query: {
        keyword: searchKey.value,
      },
    });
  }
};
</script>
<style lang="scss" scoped>
.search-container {
  border-radius: 2px;
  margin: 16px;
  padding: 10px;
  background: linear-gradient(to bottom, rgb(254, 129, 36, 0.1), #ffffff);
}

.search-title {
  font-size: 12px;
  color: #fe8124;
}

.search-arrow {
  border: solid #fe8124;
  display: inline-block;
  border-width: 0px 1px 1px 0px;
  padding: 2px 10px 2px 10px;
  margin-right: 2px;
  transform: skewX(50deg) translateY(-2px);
}

.search-title text {
  margin-left: 4px;
}

.search-textarea {
  position: relative;
  width: auto;
  margin: 12px 0;
  margin-bottom: 0px;
  background-color: #f8f6f6;
  border-radius: 4px;
}

.search-textarea-clear {
  position: absolute;
  z-index: 11;
  right: 0;
  bottom: 0;
  padding: 6px 12px;
  color: #999;
  font-size: 14px;
  text-align: right;
}

.search-btn-right {
  flex: 1;
  font-size: 20px;
  background-color: #fe8124;
  color: white;
  border-radius: 100px;
}

:deep() {
  .van-field {
    background: transparent;
  }
}
</style>

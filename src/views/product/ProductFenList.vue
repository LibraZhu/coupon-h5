<template>
  <VanNavBar title="一分购">
    <template #title>
      <VanTabs v-model:active="tabIndex" @change="onTabChange" line-width="20">
        <VanTab title="一分购" :name="0"></VanTab>
        <VanTab title="一元购" :name="1"></VanTab>
      </VanTabs>
    </template>
  </VanNavBar>
  <van-tabs
    :ellipsis="false"
    v-model:active="pTabIndex"
    color="#fe8124"
    title-active-color="#fe8124"
    @change="onPTabCahnge"
  >
    <van-tab
      v-for="item in pTabs"
      :key="item.id"
      :title="item.name"
      :name="item.id"
    >
    </van-tab>
  </van-tabs>
  <div class="divider"></div>
  <VanPullRefresh
    class="page-container"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <VanList
      v-model:loading="loadMore"
      :finished="finished"
      :finished-text="list.length > 0 ? '没有更多了' : ''"
      @load="onLoad"
    >
      <div
        style="position: relative; background-color: white"
        v-for="item in list"
        :key="item.goods_id"
      >
        <ProductItem :product="item"></ProductItem>
        <div class="divider-list"></div>
      </div>
    </VanList>
    <VanEmpty
      v-if="!refreshing && list.length === 0"
      description="还没有数据~"
    />
  </VanPullRefresh>
</template>
<script lang="ts" setup>
import { oneFenProduct, oneYuanProduct } from "@/api";
import { Product, ProductQueryParam } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import ProductItem from "@/views/product/ProductItem.vue";
import { onMounted, ref } from "vue";

useApp();
const tabIndex = ref(0);
const pTabs = [
  { id: 0, name: "综合" },
  { id: 6, name: "销量" },
  { id: 9, name: "价格" },
];
const pTabIndex = ref(0);
const listParam: ProductQueryParam = {
  page: 1,
  pageSize: 20,
};
const list = ref<Product[]>([]);
const refreshing = ref(false);
const loadMore = ref(false);
const finished = ref(false);

const onTabChange = (item: any) => {
  list.value = [];
  onRefresh();
};
const onPTabCahnge = () => {
  list.value = [];
  onRefresh();
};
const onRefresh = () => {
  refreshing.value = true;
  loadMore.value = false;
  finished.value = true;
  listParam.page = 1;
  getList();
};
const onLoad = () => {
  if (list.value.length < listParam.page) {
    return;
  }

  listParam.page++;
  getList();
};
const getList = () => {
  listParam.sortType = pTabIndex.value;
  const api = tabIndex.value === 1 ? oneYuanProduct : oneFenProduct;
  api(listParam)
    .then((res: any) => {
      const data = res.data?.list ?? [];
      if (listParam.page === 1) {
        list.value = data;
      } else {
        list.value = list.value.concat(data);
      }

      refreshing.value = false;
      loadMore.value = false;
      finished.value = list.value.length >= res.data?.total ?? 0;
    })
    .catch(() => {
      refreshing.value = false;
      loadMore.value = false;
      finished.value = true;
      if (listParam.page > 1) {
        listParam.page--;
      }
    });
};
onMounted(() => {
  onRefresh();
});
</script>
<style lang="scss" scoped>
:deep() {
  .van-tab {
    padding: 0 8px;
  }
}
</style>

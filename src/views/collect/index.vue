<template>
  <VanPullRefresh
    class="page-container"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <VanList
      v-model:loading="loadMore"
      :finished="finished"
      :finished-text="collectList.length > 0 ? '没有更多了' : ''"
      @load="onLoad"
    >
      <div
        style="position: relative; background-color: white"
        v-for="item in collectList"
        :key="item.goods_id"
      >
        <ProductItem from="collect" :product="item"></ProductItem>
        <div class="divider-list"></div>
      </div>
    </VanList>
    <VanEmpty
      v-if="!refreshing && collectList.length === 0"
      description="还没有数据~"
    />
  </VanPullRefresh>
</template>
<script lang="ts" setup>
defineOptions({
  name: "Collect",
});
import { listCollectProduct } from "@/api";
import { PageParams, Product } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import ProductItem from "@/views/product/ProductItem.vue";
import { onMounted, ref } from "vue";
useApp();
const listParam: PageParams = {
  page: 1,
  pageSize: 20,
};
const collectList = ref<Product[]>([]);
const refreshing = ref(false);
const loadMore = ref(false);
const finished = ref(false);

const onRefresh = () => {
  refreshing.value = true;
  loadMore.value = false;
  finished.value = true;
  listParam.page = 1;
  getList();
};
const onLoad = () => {
  if (collectList.value.length < listParam.page) {
    return;
  }

  listParam.page++;
  getList();
};
const getList = () => {
  listCollectProduct(listParam)
    .then((res: any) => {
      const list = res.data?.list ?? [];
      if (listParam.page === 1) {
        collectList.value = list;
      } else {
        collectList.value = collectList.value.concat(list);
      }
      refreshing.value = false;
      loadMore.value = false;
      finished.value = collectList.value.length >= res.data?.total ?? 0;
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
<style lang="scss" scoped></style>

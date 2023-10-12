<template>
  <div class="hot-tab">
    <div
      :class="
        item.id === type ? 'hot-tab-item hot-tab-item-active' : 'hot-tab-item'
      "
      v-for="item in tabs"
      wx:key="index"
      @click="onTabClick(item)"
    >
      <van-image
        width="16"
        height="16"
        :src="item.id === type ? item.icon_c : item.icon"
      />
      <text>{{ item.name }}</text>
    </div>
  </div>
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
import { hotProduct } from "@/api";
import { Product, ProductQueryParam } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import ProductItem from "@/views/product/ProductItem.vue";
import { onMounted, ref } from "vue";

defineOptions({
  name: "Hot",
  inheritAttrs: false,
});

useApp();
const { assets } = useImage();
const tabs = [
  { id: 2, name: "京东", icon: assets("jd_w.png"), icon_c: assets("jd_c.png") },
  {
    id: 1,
    name: "拼多多",
    icon: assets("pdd_w.png"),
    icon_c: assets("pdd_c.png"),
  },
  { id: 4, name: "抖音", icon: assets("dy_w.png"), icon_c: assets("dy_c.png") },
  { id: 3, name: "淘宝", icon: assets("tb_w.png"), icon_c: assets("tb_c.png") },
  {
    id: 5,
    name: "唯品会",
    icon: assets("wph_w.png"),
    icon_c: assets("wph_c.png"),
  },
];
const listParam: ProductQueryParam = {
  page: 1,
  pageSize: 20,
};
const list = ref<Product[]>([]);
const refreshing = ref(false);
const loadMore = ref(false);
const finished = ref(false);
const type = ref(2);
const onTabClick = (item: any) => {
  type.value = item.id;
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
  listParam.source = type.value;
  hotProduct(listParam)
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
.hot-navbar {
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 16px;
  padding-right: 16px;
}
.hot-tab {
  background: linear-gradient(to right, #fe8124, #e45119);
  display: flex;
  align-items: center;
  height: 46px;
  position: relative;
}

.hot-tab-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hot-tab-item-active {
  transform: scale(1.1);
}

.hot-tab-item text {
  color: #f1e5e5;
  font-size: 14px;
  margin-left: 3px;
}

.hot-tab-item-active text {
  color: #fff;
  font-weight: 500;
}
:deep() {
  .van-nav-bar {
    background: transparent;
  }
  .van-nav-bar__title {
    color: white;
  }
  .van-nav-bar__arrow {
    color: white;
  }
}
</style>

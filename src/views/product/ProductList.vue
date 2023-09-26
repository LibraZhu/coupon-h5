<template>
  <div class="search-navbar-container">
    <div class="search-navbar" style="margin-right:{{menuLeft}}px;">
      <van-image width="22px" height="22px" :src="icons[type]" />
      <div class="search-navbar-search" @click="onSearchClick">
        <van-icon name="search" color="#999"></van-icon>搜索你想要的商品
      </div>
    </div>
    <div class="search-tab">
      <div
        :class="
          item.id === tabIndex
            ? 'search-tab-item search-tab-item-active'
            : 'search-tab-item'
        "
        v-for="item in tabs"
        :key="item.id"
        @click="onTabClick(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
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
  <div class="page-container">
    <VanPullRefresh v-model="refreshing" @refresh="onRefresh">
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
          <ProductItem from="collect" :product="item"></ProductItem>
          <div class="divider-list"></div>
        </div>
      </VanList>
      <VanEmpty
        v-if="!refreshing && list.length === 0"
        description="还没有数据~"
      />
    </VanPullRefresh>
  </div>
</template>
<script lang="ts" setup>
import { listProduct } from "@/api";
import { Product, ProductQueryParam } from "@/api/model";
import { SourceEnum } from "@/enum";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import router from "@/router";
import ProductItem from "@/views/product/ProductItem.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

useApp();
const route = useRoute();
const { assets } = useImage();
const icons: Record<number, string> = {
  2: assets("jd_w.png"),
  1: assets("pdd_w.png"),
  4: assets("dy_w.png"),
  3: assets("tb_w.png"),
  5: assets("wph_w.png"),
};
const tabIndex = ref("2");
const tabs = ref([
  { id: "2", name: "精选" },
  { id: "23", name: "为你推荐" },
  { id: "41", name: "热销" },
  { id: "10", name: "9.9包邮" },
  { id: "26", name: "母婴" },
  { id: "28", name: "美妆" },
  { id: "30", name: "图书" },
  { id: "27", name: "居家" },
  { id: "25", name: "超市" },
]);
const pTabs = [
  { id: 0, name: "综合" },
  { id: 9, name: "价格" },
  { id: 6, name: "销量" },
];
const type = ref(parseInt(route.query.type?.toString() ?? "2"));
if (type.value == SourceEnum.PDD) {
  tabs.value = [
    { id: "0", name: "精选" },
    { id: "-1", name: "热销" },
    { id: "4", name: "母婴" },
    { id: "15", name: "百货" },
    { id: "1", name: "美食" },
    { id: "14", name: "女装" },
    { id: "16", name: "美妆" },
    { id: "1281", name: "鞋包" },
    { id: "743", name: "男装" },
    { id: "2478", name: "文具" },
  ];
  tabIndex.value = "0";
} else if (type.value == SourceEnum.TB) {
  tabs.value = [
    { id: "0", name: "精选" },
    { id: "1", name: "母婴" },
    { id: "2", name: "百货" },
    { id: "3", name: "美食" },
    { id: "4", name: "女装" },
    { id: "5", name: "美妆" },
    { id: "6", name: "鞋包" },
    { id: "7", name: "男装" },
    { id: "8", name: "数码" },
  ];
  tabIndex.value = "0";
} else if (type.value == SourceEnum.DY) {
  tabs.value = [
    { id: "1", name: "女装" },
    { id: "2", name: "男装" },
    { id: "8", name: "食品" },
    { id: "9", name: "美妆" },
    { id: "3", name: "箱包" },
    { id: "4", name: "护肤" },
    { id: "5", name: "家居" },
    { id: "6", name: "数码" },
    { id: "7", name: "户外" },
  ];
  tabIndex.value = "1";
} else if (type.value == SourceEnum.WPH) {
  tabs.value = [
    { id: "wbjf2n26", name: "精选" },
    { id: "4hm6c35w", name: "热销" },
    { id: "0lreb0o6", name: "母婴" },
    { id: "fqs3ruqw", name: "女装" },
    { id: "x6kihigh", name: "美妆" },
    { id: "2jo673jj", name: "鞋包" },
    { id: "kkhewi9q", name: "男装" },
    { id: "axu1ike2", name: "居家" },
  ];
  tabIndex.value = "wbjf2n26";
}
const pTabIndex = ref(0);
const listParam: ProductQueryParam = {
  page: 1,
  pageSize: 20,
};
const list = ref<Product[]>([]);
const refreshing = ref(false);
const loadMore = ref(false);
const finished = ref(false);

const onTabClick = (item: any) => {
  list.value = [];
  tabIndex.value = item.id;
  onRefresh();
};
const onSearchClick = () => {
  router.push({
    name: "SearchList",
    query: { type: type.value },
  });
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
  listParam.source = type.value;
  if (type.value == SourceEnum.WPH) {
    listParam.jxCode = tabIndex.value;
  } else {
    listParam.optId = parseInt(tabIndex.value);
  }
  listParam.sortType = pTabIndex.value;
  listProduct(listParam)
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
.search-navbar-container {
  background: linear-gradient(to right, #fe8124, #e45119);
}

.search-navbar {
  display: flex;
  align-items: center;
  height: 46px;
  padding-left: 16px;
  padding-right: 16px;
}

.search-navbar-search {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  margin-left: 10px;
  margin-right: 8px;
  padding: 4px 12px;
  background-color: white;
  border-radius: 100px;
}

.search-tab {
  display: flex;
  align-items: center;
  height: 44px;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
}
.search-tab::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.search-tab-item {
  width: auto;
  min-width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f1e5e5;
  font-size: 14px;
  margin-left: 3px;
}

.search-tab-item-active {
  transform: scale(1.1);
  color: #fff;
  font-weight: 500;
}
</style>

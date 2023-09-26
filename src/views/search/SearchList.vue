<template>
  <div class="search-navbar-container">
    <div class="search-navbar" style="margin-right:{{menuLeft}}px;">
      <div class="search-navbar-search">
        <van-icon name="search" color="#999"></van-icon>
        <van-field
          v-model="keyword"
          placeholder="输入关键词找券"
          clearable
          @clear="onKeywordClearClick"
        />
      </div>
      <div style="color: white; font-size: 14px" @click="onSearchClick">
        搜索
      </div>
    </div>
    <div class="search-tab">
      <div
        v-for="item in tabs"
        :class="
          item.id === type
            ? 'search-tab-item search-tab-item-active'
            : 'search-tab-item'
        "
        :key="item.id"
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
  </div>
  <div v-if="showHistory">
    <div class="search-history-title">
      <text>历史搜索</text>
      <van-icon
        size="22"
        color="grey"
        name="delete-o"
        @click="clearSearchHistory"
      />
    </div>
    <div class="search-history-content">
      <div
        v-for="item in historyList"
        :key="item"
        class="search-history-content-item"
        @click="onHistoryClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
  <van-tabs
    v-if="!showHistory"
    :ellipsis="false"
    v-model:active="tabIndex"
    color="#fe8124"
    title-active-color="#fe8124"
    @change="onProductTabClick"
  >
    <van-tab
      v-for="item in pTabs"
      :key="item.id"
      :title="item.name"
      :name="item.id"
    >
    </van-tab>
  </van-tabs>
  <div v-if="!showHistory" class="divider"></div>
  <VanPullRefresh
    v-if="!showHistory"
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
        <ProductItem from="collect" :product="item"></ProductItem>
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
import { searchProduct } from "@/api";
import { Product, ProductQueryParam } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import ProductItem from "@/views/product/ProductItem.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

useApp();
const route = useRoute();
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
const pTabs = [
  { id: 0, name: "综合" },
  { id: 9, name: "价格" },
  { id: 6, name: "销量" },
];
const listParam: ProductQueryParam = {
  page: 1,
  pageSize: 20,
};
const list = ref<Product[]>([]);
const historyList = ref<string[]>([]);
const refreshing = ref(false);
const loadMore = ref(false);
const finished = ref(false);
const showHistory = ref(false);
const type = ref(2);
const tabIndex = ref(0);
type.value = parseInt(route.query.type?.toString() ?? "2");
const keyword = ref(route.query.keyword?.toString() ?? "");
const onTabClick = (item: any) => {
  type.value = item.id;
  if (keyword.value) {
    list.value = [];
    onRefresh();
  }
};
const onSearchClick = () => {
  if (keyword.value) {
    saveSearchHistory();
    showHistory.value = false;
    onRefresh();
  }
};
const onKeywordClearClick = () => {
  keyword.value = "";
  list.value = [];
  showHistory.value = true;
  listParam.keyword = "";
};
const saveSearchHistory = () => {
  if (!keyword.value) {
    return;
  }
  const index = historyList.value.indexOf(keyword.value);
  if (index !== -1) {
    historyList.value.splice(index, 1);
  }
  historyList.value.splice(0, 0, keyword.value);
  // 只保存10条历史
  if (historyList.value.length > 10) {
    historyList.value.splice(10, 1);
  }
  localStorage.setItem("history", JSON.stringify(historyList.value));
};
const clearSearchHistory = () => {
  historyList.value = [];
  localStorage.removeItem("history");
};
const onHistoryClick = (s: string) => {
  keyword.value = s;
  showHistory.value = false;
  onRefresh();
};
const onProductTabClick = () => {
  listParam.sortType = tabIndex.value;
  if (keyword.value) {
    showHistory.value = false;
    list.value = [];
    onRefresh();
  }
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
  listParam.keyword = keyword.value;
  listParam.source = type.value;
  searchProduct(listParam)
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
  if (keyword.value) {
    saveSearchHistory();
    showHistory.value = false;
    onRefresh();
  } else {
    showHistory.value = true;
  }
});
</script>
<style lang="scss" scoped>
.search-navbar-container {
  background: linear-gradient(to right, #fe8124, #e45119);
}

.search-navbar {
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: 16px;
  padding-right: 16px;
}

.search-navbar-search {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  margin-left: 10px;
  margin-right: 8px;
  padding: 4px 12px;
  background-color: white;
  border-radius: 100px;
}

.search-navbar-search input {
  flex: 1;
  margin: 0px 6px;
}

.search-tab {
  display: flex;
  align-items: center;
  height: 44px;
  position: relative;
}

.search-tab-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-tab-item-active {
  transform: scale(1.1);
}
.search-tab-item text {
  color: #f1e5e5;
  font-size: 14px;
  margin-left: 3px;
}

.search-tab-item-active text {
  color: #fff;
  font-weight: 500;
}

.search-history-title {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
}

.search-history-title text {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.search-history-content {
  display: flex;
  flex-wrap: wrap;
}

.search-history-content-item {
  background-color: white;
  font-size: 12px;
  color: #666;
  border-radius: 100px;
  padding: 4px 12px;
  margin-left: 10px;
  margin-top: 10px;
}

.search-history-content-item text {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  /* 针对英文不会自动换行 */
  word-wrap: break-word;
  word-break: break-all;
}
:deep() {
  .van-field {
    padding: 0 10px;
  }
}
</style>

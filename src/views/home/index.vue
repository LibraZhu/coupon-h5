<template>
  <div class="tabbar-container home">
    <div class="top-bg"></div>
    <div class="navbar">
      <VanSearch
        v-model="search"
        class="search"
        readonly
        shape="round"
        background="linear-gradient(to right, #fe8124, #e45119)"
        placeholder=""
        @click-input="onSearchClick"
      >
        <template #left>
          <span class="tip">多多省助手</span>
        </template>
      </VanSearch>
    </div>
    <VanPullRefresh
      ref="pullRefreshRef"
      class="pullrefresh"
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <VanSwipe :autoplay="3000" indicator-color="white" class="banner">
        <VanSwipeItem
          v-for="banner in bannerList"
          :key="banner.image"
          style="border-radius: 10px"
          @click="onBannerClick(banner)"
        >
          <img style="width: 100%; border-radius: 10px" :src="banner.image" />
        </VanSwipeItem>
      </VanSwipe>
      <VanGrid :column-num="5" :border="false">
        <VanGridItem
          v-for="menu in menuList"
          :key="menu.type"
          :text="menu.name"
          @click="onMenuClick(menu)"
        >
          <template #icon>
            <img style="width: 36px; height: 36px" :src="menu.image" />
          </template>
        </VanGridItem>
      </VanGrid>
      <div class="product-container">
        <VanTabs
          v-model:active="tabIndex"
          @click-tab="onClickTab"
          line-width="20"
          color="#fe8124"
          title-active-color="#fe8124"
        >
          <VanTab
            v-for="tab in tabs"
            :title="tab.name"
            :key="tab.id"
            :name="tab.id"
          >
          </VanTab>
        </VanTabs>
        <VanList
          v-model:loading="loading"
          :finished="finished"
          :finished-text="productList.length > 0 ? '没有更多了' : ''"
          @load="onLoad"
        >
          <div
            style="position: relative"
            v-for="product in productList"
            :key="product.goods_id"
          >
            <ProductItem :product="product"></ProductItem>
            <div class="divider-list"></div>
          </div>
        </VanList>
      </div>
    </VanPullRefresh>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: "Home" });
import { listProduct, unionLink } from "@/api";
import { Product } from "@/api/model";
import EventBus from "@/bus";
import { SourceEnum } from "@/enum";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import router from "@/router";
import ProductItem from "@/views/product/ProductItem.vue";
import { onDeactivated } from "@vue/runtime-core";
import { closeToast, showLoadingToast } from "vant";
import { onActivated, onMounted, reactive, ref } from "vue";
useApp();
const { assets } = useImage();
const search = ref("购物搜券拿返利");
const tabIndex = ref(2);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const tabs = [
  { id: 2, name: "精选" },
  { id: 23, name: "为你推荐" },
  { id: 22, name: "热销" },
  { id: 10, name: "9.9包邮" },
  { id: 26, name: "母婴" },
  { id: 28, name: "美妆穿搭" },
  { id: 30, name: "图书" },
  { id: 27, name: "居家" },
  { id: 25, name: "超市" },
];
const bannerList = [{ image: assets("banner.png"), type: "search" }];
const menuList = [
  { image: assets("hot.png"), type: "hot", name: "今日热卖", routeName: "Hot" },
  {
    image: assets("jd.png"),
    type: 2,
    name: "京东优惠",
    routeName: "ProductList",
  },
  {
    image: assets("pdd.png"),
    type: 1,
    name: "拼多多",
    routeName: "ProductList",
  },
  {
    image: assets("tb.png"),
    type: 3,
    name: "淘宝优惠",
    routeName: "ProductList",
  },
  {
    image: assets("wph.png"),
    type: 5,
    name: "唯品会",
    routeName: "ProductList",
  },
  {
    image: assets("dy.png"),
    type: 4,
    name: "抖音优惠",
    routeName: "ProductList",
  },
  {
    image: assets("mt.png"),
    type: "mt",
    name: "美团外卖",
    routeName: "MeiTuan",
  },
  { image: assets("ele.png"), type: "ele", name: "饿了么", routeName: "Ele" },
  {
    image: assets("didi.png"),
    type: "didi",
    name: "滴滴打车",
    routeName: "Taxi",
  },
  {
    image: assets("movie.png"),
    type: "movie",
    name: "特价电影",
  },
];
const productList = ref<Product[]>([]);
const queryParam = reactive({
  optId: tabs[0].id,
  source: SourceEnum.JD,
  page: 1,
  pageSize: 20,
});
let scrollTop = 0;
onActivated(() => {
  document.documentElement.scrollTop = scrollTop;
  EventBus.on("backTop", backTop);
  document.addEventListener("scroll", scrollEvent);
});
onDeactivated(() => {
  EventBus.off("backTop", backTop);
  document.removeEventListener("scroll", scrollEvent);
});
const backTop = () => {
  document.documentElement.scrollTo({ left: 0, top: 0, behavior: "smooth" });
};
const scrollEvent = () => {
  scrollTop = document.documentElement.scrollTop;
  if (document.documentElement.scrollTop > 500) {
    EventBus.emit("scrollTop", true);
  } else {
    EventBus.emit("scrollTop", false);
  }
};
const onMenuClick = (menu: any) => {
  if (menu.type === "movie") {
    showLoadingToast({ message: "加载中", duration: 0 });
    unionLink(3).then((res: any) => {
      closeToast();
      setTimeout(() => {
        window.open(res.data.h5 ?? "");
      }, 100);
    });
    return;
  }
  if (menu.routeName === "ProductList") {
    router.push({
      name: "ProductList",
      query: { type: menu.type },
    });
  } else {
    router.push({
      name: menu.routeName,
    });
  }
};
const onClickTab = (tab: any) => {
  queryParam.optId = tab.name;
  onRefresh();
};
const onRefresh = () => {
  refreshing.value = true;
  loading.value = false;
  finished.value = true;
  queryParam.page = 1;
  getProductList();
};
const onLoad = () => {
  if (productList.value.length === 0) {
    return;
  }
  queryParam.page++;
  getProductList();
};
const getProductList = () => {
  listProduct(queryParam)
    .then((res: any) => {
      const list = res.data?.list ?? [];

      refreshing.value = false;
      loading.value = false;

      if (queryParam.page === 1) {
        productList.value = list;
      } else {
        productList.value = productList.value.concat(list);
      }
      finished.value = productList === res.data?.total ?? 0;
    })
    .catch(e => {
      if (queryParam.page > 1) {
        queryParam.page--;
      }
      refreshing.value = false;
      loading.value = false;
      finished.value = true;
    });
};
onMounted(() => {
  onRefresh();
});
const onBannerClick = (banner: any) => {};
const onSearchClick = () => {
  router.push({ name: "Search" });
};
</script>
<style lang="scss">
.home {
  .top-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 108px;
    background: linear-gradient(to right, #fe8124, #e45119);
  }
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: var(--van-sticky-z-index);
  }
  .search {
    border: 1px solid transparent;
    .tip {
      font-size: 16px;
      color: white;
      font-weight: 500;
      padding-right: 16px;
    }
  }
  .pullrefresh {
    width: 100%;
    margin-top: 54px;
    box-sizing: border-box;
  }

  .banner {
    border-radius: 10px;
    margin-left: 10px;
    margin-top: 4px;
    width: calc(100% - 20px);
  }

  .product-container {
    background-color: white;
    border-radius: 8px;
    margin: 16px 10px;
  }

  .van-grid-item__content {
    background-color: transparent;
    padding-bottom: 0px;
  }
  .van-tabs__wrap {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .van-field__control {
    color: #fe8124;
    font-size: 12px;
  }
  .van-pull-refresh__head {
    color: white;
    background: linear-gradient(to right, #fe8124, #e45119);
  }
  .van-loading {
    color: white;
  }
  .van-loading__text {
    color: white;
  }
}
</style>

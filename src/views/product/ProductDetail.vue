<template>
  <div class="product-detail">
    <VanNavBar
      title="商品详情"
      :left-arrow="false"
      fixed
      class="navbar"
      :style="navbarStyle"
    >
      <template #title>
        <VanTabs
          v-model:active="tabIndex"
          @click-tab="onClickTab"
          line-width="20"
          :color="tabColor"
          :title-active-color="tabColor"
          :title-inactive-color="tabColor"
          background="rgba(0,0,0,0)"
        >
          <VanTab title="宝贝" :name="0"></VanTab>
          <VanTab title="详情" :name="1"></VanTab>
        </VanTabs>
      </template>
    </VanNavBar>
    <VanSwipe :width="imageWidth" :height="imageWidth">
      <VanSwipeItem v-for="pic in picList">
        <img style="width: 100%" :src="pic" />
      </VanSwipeItem>
    </VanSwipe>
    <div class="flex p-10 bg-white">
      <span class="product-price-after">¥{{ product.price_after }}</span>
      <div class="flexable">
        <div v-if="product.source === 5" class="product-discount-tip">
          折扣价
        </div>
        <div v-else-if="product.discount != '0'" class="product-coupon-tip">
          券后
        </div>
        <div class="product-coupon-tip">券后</div>
        <div class="product-price">原价¥{{ product.price }}</div>
      </div>
      <span class="product-sales">
        {{ product.salesTip }}
      </span>
    </div>
    <div class="product-title bg-white">
      <VanIcon v-if="type" :name="icons[type]" />
      {{ product.goods_name }}
    </div>
    <div class="bg-white p-10">
      <div
        v-if="product.discount != '0'"
        class="product-coupon flex bg-white"
        @click="onCouponClick"
      >
        <div class="top-left flex flex-center">
          <i class="dot dot-top"></i>
          <i class="dot dot-bottom"></i>
          <i class="dot-divider"></i>
          {{ product.discount }}元优惠券
        </div>
        <span class="text">立即领取</span>
        <VanIcon name="arrow" color="#fff" />
      </div>
    </div>
    <div class="product-pic">
      <div ref="tabRef" class="product-pic-title">
        <div class="product-pic-line"></div>
        <span>宝贝详情</span>
      </div>
      <img style="width: 100%" v-for="pic in picList" :src="pic" />
    </div>
    <div
      style="min-height: 74px; background-color: #f5f5f5"
      class="van-safe-area-bottom"
    ></div>
    <div class="product-bottom-container van-safe-area-bottom">
      <div class="product-bottom">
        <VanSpace :size="0">
          <div class="product-to-home" @click="onHomeClick">
            <VanIcon size="20" name="wap-home-o" />
            <span style="width: 40px; text-align: center">首页</span>
          </div>
          <div class="product-to-home" @click="onFavClick">
            <VanIcon v-if="fav" size="20" name="star" color="#fe8124" />
            <VanIcon v-else size="20" name="star-o" />
            <span style="width: 40px; text-align: center">{{
              fav ? "已收藏" : "收藏"
            }}</span>
          </div>
        </VanSpace>
        <VanButton
          round
          color="#ffcd6d"
          style="margin-left: 10px; color: #333; flex: 1"
          @click="onShareClick"
        >
          {{ `分享赚¥${product.rebate ?? ""}` }}
        </VanButton>
        <VanButton
          round
          color="#e45119"
          style="margin-left: 10px; flex: 1"
          @click="onOrderClick"
        >
          {{ `下单返¥${product.rebate ?? ""}` }}
        </VanButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { collectCheck, collectHandle, getLink, productDetail } from "@/api";
import { Product, ProductDetailParam } from "@/api/model";
import { SourceEnum } from "@/enum";
import { useApp } from "@/hooks/useApp";
import { Base64 } from "js-base64";
import { closeToast, showLoadingToast, showToast } from "vant";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
useApp();
const tabRef = ref();
const imageWidth = ref(document.body.clientWidth);
let scrollTop = 0;
onMounted(() => {
  scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  document.addEventListener("scroll", scrollEvent);
});
onBeforeUnmount(() => {
  document.removeEventListener("scroll", scrollEvent);
});
const product = ref<Product>(
  JSON.parse(
    route.query.data ? Base64.decode(route.query.data.toString()) : "{}"
  )
);
const picList = ref<string[]>(product.value.picurls?.split(",") ?? []);
const type = parseInt(route.query.type?.toString() ?? "0");
const id = route.query.id?.toString();
if (id) {
  showLoadingToast({ message: "加载中" });
  const param: ProductDetailParam = {
    productId: id,
    source: parseInt(route.query.type?.toString() ?? "0"),
    searchId: route.query.sid?.toString() ?? "",
  };
  productDetail(param).then(res => {
    closeToast();
    if (!res.data) {
      showToast("商品已下架");
    } else {
      product.value = res.data;
      picList.value = res.data.picurls?.split(",") ?? [];
      collectCheck(product.value.goods_id).then((res: any) => {
        fav.value = res.data ?? false;
      });
    }
  });
} else {
  collectCheck(product.value.goods_id).then((res: any) => {
    fav.value = res.data ?? false;
  });
}
const tabIndex = ref(0);
let lastTab = 0;
const icons: Record<string, string> = {
  2: new URL("@/assets/jd.png", import.meta.url).href,
  1: new URL("@/assets/pdd.png", import.meta.url).href,
  4: new URL("@/assets/dy.png", import.meta.url).href,
  3: new URL("@/assets/tb.png", import.meta.url).href,
  5: new URL("@/assets/wph.png", import.meta.url).href,
};
const fav = ref(false);

const navbarStyle = ref({
  background:
    "linear-gradient(to right, rgba(254,129,36,0), rgba(228,81,25,0))",
});
const tabColor = ref("rgba(255,255,255,0)");
const navbarBackStyle = ref({ "background-color": "rgba(0,0,0,0.4)" });
const scrollEvent = () => {
  // 滑动标题栏渐变
  scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let opacity = Math.abs(Math.round(scrollTop)) / 250;
  navbarStyle.value = {
    background: `linear-gradient(to right, rgba(254,129,36,${opacity}), rgba(228,81,25,${opacity}))`,
  };
  tabColor.value = `rgba(255,255,255,${opacity})`;
  if (opacity > 0.4) {
    navbarBackStyle.value = {
      "background-color": "rgba(0,0,0,0)",
    };
  } else {
    navbarBackStyle.value = {
      "background-color": `rgba(0,0,0,${0.4 - opacity})`,
    };
  }

  // 滑动到图文，tab对应跳转
  if (tabRef.value.getBoundingClientRect().top < 56) {
    tabIndex.value = 1;
  } else {
    tabIndex.value = 0;
  }
};

const onClickTab = (tab: any) => {
  if (tab.name === lastTab) {
    return;
  }
  lastTab = tab.name;
  if (tab.name === 0) {
    document.documentElement.scrollTo({ top: 0 });
  } else {
    document.documentElement.scrollBy({
      top: tabRef.value.getBoundingClientRect().top - 46,
    });
  }
};
const onCouponClick = () => {
  onOrderClick();
};
const onHomeClick = () => {
  router.push({
    name: "home",
  });
};
const onFavClick = () => {
  const collectProduct = {
    source: product.value.source,
    goods_id: product.value.goods_id,
    goods_name: product.value.goods_name,
    price: product.value.price,
    price_after: product.value.price_after,
    discount: product.value.discount,
    picurl: product.value.picurl,
    salesTip: product.value.salesTip,
    owner: product.value.owner,
    rebate: product.value.rebate,
    searchId: product.value.searchId,
    discountWph: product.value.discountWph,
  };
  collectHandle(
    product.value.goods_id,
    !fav.value,
    JSON.stringify(collectProduct)
  ).then((res: any) => {
    fav.value = res.data ?? false;
  });
};
const onOrderClick = () => {
  showLoadingToast({ message: "加载中", duration: 0 });
  const param: ProductDetailParam = {
    productId: product.value.goods_id,
    source: product.value.source,
    couponUrl: product.value.couponurl,
    searchId: product.value.searchId,
  };
  getLink(param).then(res => {
    closeToast();
    if (type == SourceEnum.JD) {
      window.location.href = res.data;
    } else if (type == SourceEnum.PDD) {
      window.location.href = res.data.mobileShortUrl;
    } else if (type == SourceEnum.TB) {
      copy(res.data, "复制成功,打开淘宝app下单");
    } else if (type == SourceEnum.DY) {
      copy(res.data, "复制成功,打开抖音app下单");
    } else if (type == SourceEnum.WPH) {
      window.location.href = res.data.url;
    }
  });
};
const onShareClick = () => {
  showLoadingToast({ message: "加载中", duration: 0 });
  const param: ProductDetailParam = {
    productId: product.value.goods_id,
    source: product.value.source,
    couponUrl: product.value.couponurl,
    searchId: product.value.searchId,
  };
  getLink(param).then(res => {
    closeToast();
    let data = res.data;
    if (type == SourceEnum.PDD) {
      data = res.data.mobileShortUrl;
    } else if (type == SourceEnum.WPH) {
      data = res.data.url;
    }
    copy(data, "内容已复制");
  });
};

const copy = (data: string, message: string) => {
  const copy = function (e: any) {
    e.clipboardData.setData("text/plain", data);
    e.preventDefault();
  };
  document.addEventListener("copy", copy, { once: true });
  document.execCommand("copy");
  showToast(message);
};
</script>
<style lang="scss">
.product-detail {
  position: relative;
  .navbar {
    height: 46px;
    .back-icon-border {
      border-radius: 100px;
      padding: 4px;
    }
  }

  .bg-white {
    background-color: white;
  }

  .product-title {
    color: #333;
    font-size: 17px;
    font-weight: 500;
    padding: 0px 10px;
  }

  .product-discount-tip {
    display: inline-block;
    margin-left: 10px;
    color: white;
    font-size: 12px;
    border-radius: 3px;
    padding: 1px 3px;
    background-color: #f5391a;
  }

  .product-coupon-tip {
    display: inline-block;
    text-align: center;
    width: 40px;
    height: 18px;
    margin-left: 10px;
    line-height: 18px;
    color: white;
    font-size: 12px;
    border-radius: 3px;
    background: radial-gradient(circle at 0 9px, transparent 3px, #f5391a 3px)
        top left,
      linear-gradient(0.25turn, #f5391a, #f5391a),
      radial-gradient(circle at 10px 9px, transparent 3px, #f5391a 3px) bottom
        right;
    background-size: 10px 18px, 22px 18px, 10px 18px;
    background-repeat: no-repeat;
    background-position: 0px 0px, 9px 0px, 30px 0px;
  }
  .product-coupon {
    height: 70px;
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 30px;
    border-radius: 10px;
    background: linear-gradient(to right, #fe8124, #e45119);
    .top-left {
      flex: 1;
      color: black;
      font-weight: 500;
      font-size: 18px;
      height: 70px;
      border-radius: 10px;
      border-top-right-radius: 35px;
      border-bottom-right-radius: 35px;
      position: relative;
      background: linear-gradient(to right, #ffe697, #ffcd6d);
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: linear-gradient(to right, #ec5a26, #eb5826);
        position: absolute;
      }
      .dot-top {
        top: -3px;
        right: 30px;
      }
      .dot-bottom {
        bottom: -3px;
        right: 30px;
      }
      .dot-divider {
        width: 3px;
        top: 3px;
        right: 33px;
        height: 64px;
        position: absolute;
        border-right: 1px dotted #fe8124;
      }
    }
    .text {
      color: white;
      font-size: 18px;
      font-weight: 400;
      width: 40px;
      padding-left: 30px;
      padding-right: 8px;
    }
  }

  .product-price {
    color: #888;
    font-size: 12px;
    text-decoration: line-through;
    margin-left: 6px;
  }

  .product-sales {
    color: #888;
    font-size: 12px;
  }

  .product-divider {
    flex: 1;
    display: flex;
    align-items: center;
    div {
      width: 100%;
      height: 1px;
      background-color: #f5f5f5;
      margin-left: 10px;
    }
  }
  .product-price-after-tip {
    color: #ce0017;
    font-size: 12px;
    margin-left: 10px;
  }

  .product-price-after {
    color: #ce0017;
    font-size: 26px;
    font-weight: 500;
  }
  .product-pic {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-top: 10px;
    background-color: white;
    .product-pic-title {
      font-size: 14px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;

      .product-pic-line {
        width: 4px;
        height: 16px;
        background-color: #fe8124;
        border-radius: 2px;
      }
      span {
        margin-left: 4px;
      }
    }
  }

  .product-bottom-container {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: white;
  }
  .product-bottom {
    width: calc(100% - 20px);
    padding: 10px;
    display: flex;
    align-items: center;
    .product-to-home {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding-left: 4px;
      padding-right: 4px;
      span {
        font-size: 12px;
      }
    }
  }
}
</style>

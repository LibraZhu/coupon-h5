<template>
  <VanTabs v-model:active="tabIndex" @change="onTabChange">
    <VanTab
      v-for="tab in tabList"
      :key="tab.id"
      :title="tab.name"
      :name="tab.id"
    ></VanTab>
  </VanTabs>
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
      <div v-for="item in list" :key="item.id">
        <div style="height: 12px"></div>
        <div class="flex-column order-item">
          <span class="order-time">订单号：{{ item.orderId }}</span>
          <div class="flex">
            <span class="flexable order-time">下单：{{ item.orderTime }}</span>

            <span v-if="item.finishTime" class="flexable order-time"
              >完成：{{ item.finishTime }}</span
            >
          </div>
          <div
            class="divider"
            style="margin-top: 7px; margin-bottom: 7px"
          ></div>
          <div class="flex">
            <VanImage width="80" height="80" :src="item.imageUrl"></VanImage>
            <div class="order-product-content">
              <div class="order-product-title van-multi-ellipsis--l2">
                <VanImage
                  width="16"
                  height="16"
                  :src="icons[item.orderSource ?? 0].toString()"
                ></VanImage>
                {{ item.skuName }}
              </div>
              <div class="flex order-product-price">
                <div style="font-size: 12px">¥</div>
                <div>{{ item.priceTotal }}</div>
                <div class="order-product-num">共{{ item.skuNum }}件</div>
                <div style="margin-right: 16px" v-if="item.rebate">
                  返
                  <span style="font-size: 12px">¥</span>{{ item.rebate }}
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.status"
            class="order-status-bg-b"
            :class="{ 'order-status-bg-invalid': item.status === 4 }"
          ></div>
          <div v-if="item.status" class="order-status-span">
            {{
              item.status === 1
                ? "待收货"
                : item.status === 2
                ? "待结算"
                : item.status === 3
                ? "已结算"
                : "已失效"
            }}
          </div>
        </div>
      </div>
    </VanList>
    <VanEmpty
      v-if="!refreshing && list.length === 0"
      style="height: calc(100vh - 150px)"
      description="还没有数据~"
    />
  </VanPullRefresh>
</template>
<script lang="ts" setup>
import { orderList } from "@/api";
import { Order, OrderListParam } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
defineOptions({
  name: "Order",
});
useApp();
const route = useRoute();
const router = useRouter();
const { assets } = useImage();
const tabList = [
  { id: 0, name: "全部" },
  { id: 1, name: "待收货" },
  { id: 2, name: "待结算" },
  { id: 3, name: "已结算" },
  { id: 4, name: "已失效" },
];
const icons: Record<number, String> = {
  1: assets("pdd.png"),
  2: assets("jd.png"),
  3: assets("tb.png"),
  4: assets("dy.png"),
  5: assets("wph.png"),
};
const tabIndex = ref(0);
tabIndex.value = parseInt(route.query.type?.toString() ?? "0");
const listParam: OrderListParam = {
  page: 1,
  pageSize: 20,
};
const list = ref<Order[]>([]);
const refreshing = ref(false);
const loadMore = ref(false);
const finished = ref(false);
const onTabChange = () => {
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
  if (tabIndex.value !== 0) {
    listParam.status = tabIndex.value;
  } else {
    listParam.status = undefined;
  }
  orderList(listParam)
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
.order-item {
  background-color: white;
  padding: 10px;
  position: relative;
}

.order-status-bg-b {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 0;
  height: 0;
  text-align: center;
  border-width: 32px;
  border-style: solid;
  border-color: #8080ff #8080ff transparent transparent;
}
.order-status-bg-invalid {
  border-color: #dcdee0 #dcdee0 transparent transparent;
}

.order-status-bg-b::after {
  content: "";
  position: absolute;
  top: -32px;
  right: -32px;
  width: 0;
  height: 0;
  text-align: center;
  border-width: 16px;
  border-style: solid;
  border-color: white white transparent transparent;
}

.order-status-span {
  position: absolute;
  top: 16px;
  right: -6px;
  width: 60px;
  text-align: center;
  color: white;
  font-size: 14px;
  transform: rotate(45deg);
}

.order-time {
  font-size: 12px;
  color: #333;
  margin-top: 2px;
}

.order-product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.order-product-title {
  color: #333;
  font-size: 14px;
  margin-left: 8px;
}

.order-product-price {
  font-size: 16px;
  margin-left: 8px;
  margin-top: 8px;
  color: #333;
  font-weight: 400;
}

.order-product-num {
  margin-left: 10px;
  flex: 1;
  font-size: 12px;
  color: #999;
}

.order-product-rebate {
  display: inline-block;
  text-align: center;
  width: 70px;
  height: 22px;
  margin-left: 10px;
  line-height: 22px;
  color: #e45119;
  font-size: 14px;
  border-radius: 3px;
  background: radial-gradient(circle at 0 11px, transparent 3px, #ffebe6 3px)
      top left,
    linear-gradient(0.25turn, #ffebe6, #ffebe6),
    radial-gradient(circle at 10px 11px, transparent 3px, #ffebe6 3px) bottom
      right;
  background-size: 10px 22px, 52px 22px, 10px 22px;
  background-repeat: no-repeat;
  background-position: 0px 0px, 9px 0px, 60px 0px;
}
</style>

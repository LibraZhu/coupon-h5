<template>
  <div class="page-container">
    <VanPullRefresh
      class="full-height"
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <VanList
        v-model:loading="loadMore"
        :finished="finished"
        :finished-text="cashList.length > 0 ? '没有更多了' : ''"
        @load="onLoad"
      >
        <div
          style="position: relative; background-color: white; margin-top: 10px"
          v-for="item in cashList"
          :key="item.id"
        >
          <div class="flex-column pb-10">
            <div class="cash-record-name flex" style="margin: 7px">
              <div class="flexable">{{ item.createTime }}</div>
              <div>单号：{{ item.recordSn }}</div>
            </div>
            <div class="divider"></div>
            <div class="cash-record-name">平台补贴提现</div>
            <div class="cash-record-money">¥{{ item.money }}</div>
            <div class="cash-record-name">
              <text>支付账户：</text>
              <text class="cash-record-value">微信号{{ item.payAccount }}</text>
            </div>
            <div
              v-if="item.payTime"
              class="cash-record-name"
              style="margin-top: 0px"
            >
              <text>支付时间：</text>
              <text class="cash-record-value">{{ item.payTime }}</text>
            </div>
            <VanImage
              class="cash-record-status"
              :src="statusImages[item.payStatus ?? 0]?.toString()"
            />
          </div>
          <div class="divider-list"></div>
        </div>
      </VanList>
      <VanEmpty
        v-if="!refreshing && cashList.length === 0"
        description="还没有数据~"
      />
    </VanPullRefresh>
  </div>
</template>
<script lang="ts" setup>
import { walletCashList } from "@/api";
import { PageParams, WalletRecord } from "@/api/model";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
useApp();
const route = useRoute();
const router = useRouter();
const { assets } = useImage();
const statusImages: Record<number, String> = {
  0: assets("pay_ing.png"),
  1: assets("pay_success.png"),
  2: assets("pay_fail.png"),
};
const listParam: PageParams = {
  page: 1,
  pageSize: 20,
};
const cashList = ref<WalletRecord[]>([]);
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
  if (cashList.value.length < listParam.page) {
    return;
  }

  listParam.page++;
  getList();
};
const getList = () => {
  walletCashList(listParam)
    .then((res: any) => {
      const list = res.data?.list ?? [];
      if (listParam.page === 1) {
        cashList.value = list;
      } else {
        cashList.value = cashList.value.concat(list);
      }
      refreshing.value = false;
      loadMore.value = false;
      finished.value = cashList.value.length >= res.data?.total ?? 0;
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
.cash-record-name {
  font-size: 12px;
  color: #999999;
  margin-top: 7px;
  margin-left: 7px;
}

.cash-record-value {
  font-size: 12px;
  color: #333333;
}

.cash-record-money {
  margin-top: 7px;
  margin-left: 7px;
  font-size: 18px;
  color: #333333;
}

.cash-record-status {
  width: 50px;
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>

<template>
  <div class="mine-navbar-container">
    <div class="mine-navbar">个人中心</div>
  </div>

  <VanPullRefresh
    ref="pullRefreshRef"
    class="page-container"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <div class="mine-scroll-top-space">
      <img
        style="width: 50px; height: 50px; z-index: 1; border-radius: 100px"
        :src="assets('avatar.png')"
      />
      <div
        class="flex-column"
        style="z-index: 1; margin-left: 6px; color: white"
      >
        <span style="font-size: 14px; margin-top: 6px">微信用户</span>
        <span style="font-size: 12px; margin-top: 1px">公众号: A多多省</span>
      </div>
    </div>
    <div class="mine-cash-out-container">
      <div class="flex">
        <div class="flex-column flexable">
          <span class="mine-cash-out-title">账户余额(元)</span>
          <span class="mine-cash-out-content">{{ money }}</span>
        </div>
        <VanButton
          size="mini"
          round
          color="linear-gradient(to right, #ef3752, #fe5f31)"
          style="padding: 0px 12px"
          @click="onWalletClick"
        >
          去提现
        </VanButton>
      </div>
      <div class="flex" style="margin-top: 20px">
        <div class="flex-column flexable">
          <span class="mine-cash-out-title">待结算订单(单)</span>
          <span class="mine-cash-out-content">{{ settleOrderNum }}</span>
        </div>
        <div class="flex-column flexable">
          <span class="mine-cash-out-title">待结算佣金(元)</span>
          <span class="mine-cash-out-content">{{ unSettleMoney }}</span>
        </div>
        <div class="flex-column flexable">
          <span class="mine-cash-out-title">累计提现(元)</span>
          <span class="mine-cash-out-content">{{ cashOutMoney }}</span>
        </div>
      </div>
    </div>

    <div class="mine-menu flex">
      <div
        class="mine-menu-item"
        style="width: auto; flex: 1"
        @click="onWalletClick"
      >
        <img class="mine-menu-image" :src="assets('cash_out.png')" />
        <div class="mine-menu-name">钱包提现</div>
      </div>
      <div style="width: 1px; height: 50px; background-color: #f5f5f5"></div>
      <div
        class="mine-menu-item"
        style="width: auto; flex: 1"
        @click="onCashRecordClick"
      >
        <img class="mine-menu-image" :src="assets('cash_out_record.png')" />
        <div class="mine-menu-name">提现记录</div>
      </div>
    </div>
    <div class="mine-order">
      <div class="flex p-10" @click="onOrderClick(0)">
        <span class="flexable">我的订单</span>
        <span>全部</span>
        <van-icon name="arrow"></van-icon>
      </div>

      <div class="mine-order-menu">
        <div class="mine-menu-item" @click="onOrderClick(1)">
          <img
            class="mine-order-menu-image"
            :src="assets('order_deliver.png')"
          />
          <div class="mine-order-menu-name">待收货</div>
        </div>
        <div class="mine-menu-item" @click="onOrderClick(2)">
          <img
            class="mine-order-menu-image"
            :src="assets('order_complete.png')"
          />
          <div class="mine-order-menu-name">待结算</div>
        </div>
        <div class="mine-menu-item" @click="onOrderClick(3)">
          <img
            class="mine-order-menu-image"
            :src="assets('order_settled.png')"
          />
          <div class="mine-order-menu-name">已结算</div>
        </div>
        <div class="mine-menu-item" @click="onOrderClick(4)">
          <img
            class="mine-order-menu-image"
            :src="assets('order_invalid.png')"
          />
          <div class="mine-order-menu-name">已失效</div>
        </div>
      </div>
    </div>
    <div class="mine-menu">
      <div class="mine-menu-item" @click="onHelpClick">
        <img class="mine-menu-image" :src="assets('help.png')" />
        <div class="mine-menu-name">帮助中心</div>
      </div>
      <div class="mine-menu-item" @click="onCollectClick">
        <img class="mine-menu-image" :src="assets('collect.png')" />
        <div class="mine-menu-name">我的收藏</div>
      </div>
      <div class="mine-menu-item" @click="onCustomerServiceClick">
        <img class="mine-menu-image" :src="assets('weixin.png')" />
        <div class="mine-menu-name">召唤客户</div>
      </div>
      <div class="mine-menu-item" @click="onUserClick">
        <img class="mine-menu-image" :src="assets('setting.png')" />
        <div class="mine-menu-name">个人设置</div>
      </div>
    </div>
  </VanPullRefresh>
  <van-dialog
    v-model:show="dialogVisible"
    width="240"
    confirm-button-text="取消"
  >
    <van-image width="240" :src="assets('dds.jpg')" />
  </van-dialog>
</template>
<script lang="ts" setup>
import { walletNumber } from "@/api";
import { useApp } from "@/hooks/useApp";
import { useImage } from "@/hooks/useImage";
import router from "@/router";
import { onActivated, ref } from "vue";
defineOptions({ name: "Mine" });
useApp();
const refreshing = ref(false);
const money = ref("0.00");
const settleOrderNum = ref("0");
const unSettleMoney = ref("0.00");
const cashOutMoney = ref("0.00");
const { assets } = useImage();
const dialogVisible = ref(false);
const onRefresh = () => {
  walletNumber()
    .then((res: any) => {
      refreshing.value = false;
      money.value = res.data.money;
      settleOrderNum.value = res.data.settleOrderNum;
      unSettleMoney.value = res.data.unSettleMoney;
      cashOutMoney.value = res.data.cashOutMoney;
    })
    .catch(() => (refreshing.value = false));
};
const onWalletClick = () => {
  router.push({
    name: "Wallet",
  });
};
const onCashRecordClick = () => {
  router.push({
    name: "CashRecord",
  });
};
const onOrderClick = (type: number) => {
  router.push({
    name: "Order",
    query: { type },
  });
};
const onHelpClick = () => {
  router.push({
    name: "Help",
  });
};
const onCollectClick = () => {
  router.push({
    name: "Collect",
  });
};
const onCustomerServiceClick = () => {
  dialogVisible.value = true;
};
const onUserClick = () => {
  router.push({
    name: "Setting",
  });
};
onActivated(() => {
  onRefresh();
});
</script>
<style lang="scss" scoped>
.mine-navbar-container {
  background: linear-gradient(to right, #ef3752, #fe5f31);
}

.mine-navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: 18px;
  color: white;
  font-weight: 400;
}

.mine-scroll-top-space {
  display: flex;
  height: 120px;
  padding: 10px;
}

.mine-scroll-top-space::after {
  content: "";
  position: absolute;
  height: 120px;
  width: 140%;
  top: 0;
  left: -20%;
  // z-index: -1;
  padding: 10px;
  border-radius: 0 0 50% 50%;
  background: linear-gradient(to right, #ef3752, #fe5f31);
}

.mine-cash-out-container {
  position: relative;
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: -70px;
  z-index: 1;
  padding: 16px;
  background: linear-gradient(to bottom, #434343, #1a1a1a);
}

.mine-cash-out-title {
  font-size: 13px;
  color: #e0d4b5;
}

.mine-cash-out-content {
  font-size: 18px;
  color: #e0d4b5;
}

.mine-order {
  margin: 10px;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-size: 14px;
}

.mine-order-menu {
  display: flex;
  flex-wrap: wrap;
}

.mine-order-menu-image {
  height: 26px;
  width: 26px;
}

.mine-order-menu-name {
  margin-top: 6px;
  font-size: 13px;
  color: #666;
}

.mine-menu {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  border-radius: 4px;
  background-color: white;
}

.mine-menu-item {
  width: 25%;
  padding-top: 16px;
  padding-bottom: 16px;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mine-menu-image {
  height: 32px;
  width: 32px;
}

.mine-menu-name {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}
</style>

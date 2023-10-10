<template>
  <div class="page-container">
    <div style="margin: 8px 16px">
      <div class="wallet-money-container">
        <div>账户余额(元)</div>
        <div class="wallet-money">{{ money }}</div>
      </div>
    </div>
    <div
      class="flex"
      style="margin-top: 4px; margin-left: 16px; margin-right: 16px"
    >
      <div
        :class="tabIndex == 0 ? 'wallet-tab-b' : 'wallet-tab-left'"
        @click="onCashTabClick"
      >
        <div :class="tabIndex == 0 ? 'wallet-tab-span-b' : 'wallet-tab-span'">
          提现
        </div>
      </div>
      <div
        :class="tabIndex == 1 ? 'wallet-tab-b' : 'wallet-tab-right'"
        @click="onDetailTabClick"
      >
        <div :class="tabIndex == 1 ? 'wallet-tab-span-b' : 'wallet-tab-span'">
          明细
        </div>
      </div>
    </div>
    <div class="wallet-content">
      <div v-if="tabIndex == 0" class="flex-column" style="margin: 0px 16px">
        <div class="wallet-radio">
          <span>微信</span>
          <span class="wallet-radio-weixin" @click="onWeixinClick">
            {{ weixinDes }}<van-icon name="arrow"></van-icon>
          </span>
        </div>
        <div class="wallet-cash-title">提现金额（元）</div>
        <div class="wallet-input-container flex">
          <span style="font-size: 36px">¥</span>
          <VanField
            v-model="cashMoney"
            type="number"
            @update:model-value="bindMoneyInput"
          />
        </div>
        <div class="divider" style="margin-top: 2px" />
        <VanButton class="wallet-btn" round color="coral" @click="onCashClick">
          申请提现
        </VanButton>
      </div>
      <VanPullRefresh
        v-else
        class="page-container"
        v-model="refreshing"
        @refresh="onRefresh"
      >
        <VanList
          v-model:loading="loadMore"
          :finished="finished"
          :finished-text="logList.length > 0 ? '没有更多了' : ''"
          @load="onLoad"
        >
          <div
            class="flex-column p-16"
            style="position: relative"
            v-for="item in logList"
            :key="item.id"
          >
            <div class="flex">
              <div class="flexable wallet-list-title">{{ item.des }}</div>
              <div class="wallet-list-money">{{ item.changeMoney }}</div>
            </div>
            <div class="flex pt-10">
              <div class="flexable wallet-list-content">
                {{ item.createTime }}
              </div>
              <div class="wallet-list-content">账户余额 {{ item.money }}</div>
            </div>
            <div class="divider-list"></div>
          </div>
          <VanEmpty
            v-if="!refreshing && logList.length === 0"
            description="还没有数据~"
          />
        </VanList>
      </VanPullRefresh>
    </div>
  </div>
  <van-dialog
    v-model:show="dialogInfo.visible"
    title="提现微信号"
    show-cancel-button
    :before-close="beforeClose"
    @open="dialogInfo.inputValue = weixin"
    @confirm="onWeixinInputConfirm"
  >
    <div style="padding: 10px">
      <VanField
        v-model="dialogInfo.inputValue"
        style="border: 1px solid #dcdcdc"
        clearable
        placeholder="请输入微信号"
      />
      <div style="font-size: 12px; color: #fe8124; margin-top: 8px">
        提醒：<br />1.微信号只可填写一次，请谨慎填写。<br />2.如需更换，请用提现微信号和客服联系申请。
      </div>
    </div>
  </van-dialog>
</template>
<script lang="ts" setup>
import {
  walletInfo,
  walletLogList,
  walletModify,
  walletRecordCash,
} from "@/api";
import { useApp } from "@/hooks/useApp";
import { showDialog, showLoadingToast, showToast } from "vant";
import { nextTick, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  PageParams,
  WalletCashParam,
  WalletLog,
  WalletModifyParam,
} from "../../api/model";

defineOptions({
  name: "Wallet",
});
useApp();
const router = useRouter();
const route = useRoute();
const tabIndex = ref(0);
const cashMoney = ref("");
const money = ref("0.00");
const weixinDes = ref("添加微信号");
const weixin = ref("");
const refreshing = ref(false);
const loadMore = ref(false);
const finished = ref(false);
const cashParam = reactive<WalletCashParam>({
  money: "",
  account: "",
  payType: 1,
});
const listParam = reactive<PageParams>({
  page: 1,
  pageSize: 20,
});
const logList = ref<WalletLog[]>([]);
const dialogInfo = reactive({
  visible: false,
  inputValue: "",
});
walletInfo().then((res: any) => {
  const data = res.data || {};
  money.value = data.money ?? "0.00";
  weixin.value = data.weixin ?? "";
  if (weixin.value) {
    weixinDes.value = "微信号" + data.weixin;
  } else {
    weixinDes.value = "添加微信号";
  }
});
const beforeClose = (action: string) => {
  if (action === "confirm" && dialogInfo.inputValue.length === 0) {
    return false;
  } else {
    return true;
  }
};
const onWeixinInputConfirm = () => {
  if (dialogInfo.inputValue.length === 0) {
    showToast("请输入微信号");
    return;
  }
  const param: WalletModifyParam = {
    weixin: dialogInfo.inputValue,
  };
  walletModify(param).then(res => {
    if (res.data) {
      weixin.value = param.weixin ?? "";
      weixinDes.value = "微信号" + param.weixin;
    } else {
      showToast("修改失败");
    }
  });
};
const onCashTabClick = () => {
  tabIndex.value = 0;
};
const onDetailTabClick = () => {
  tabIndex.value = 1;
  if (logList.value.length === 0) {
    onRefresh();
  }
};
const onWeixinClick = () => {
  if (!weixin.value) {
    dialogInfo.visible = true;
  }
};
const bindMoneyInput = (e: string) => {
  let value = e;
  const index = value.indexOf(".");
  if (index == 0) {
    value = "0.";
  }
  if (index != -1 && value.length - 1 - index > 2) {
    value = value.substring(0, index + 3);
  }
  nextTick(() => {
    cashMoney.value = value;
  });
};
const onCashClick = () => {
  if (!cashMoney.value) {
    showToast("请输入提现金额");
    return;
  }
  if (parseFloat(cashMoney.value) < 1) {
    showToast("提现金额不能少于1元");
    return;
  }
  if (!weixin) {
    showToast("请添加微信号");
    return;
  }
  cashParam.money = cashMoney.value;
  cashParam.account = weixin.value;
  showDialog({
    title: "提现申请",
    message: "提现到微信号：" + weixin.value,
    showCancelButton: true,
  }).then(() => {
    const loading = showLoadingToast({ message: "提交申请", duration: 0 });
    walletRecordCash(cashParam)
      .then((res: any) => {
        loading.close();
        router.replace({
          name: "CashResult",
          query: { sn: res.data },
        });
      })
      .catch(() => setTimeout(() => loading.close(), 1000));
  });
};
const onRefresh = () => {
  refreshing.value = true;
  loadMore.value = false;
  finished.value = true;
  listParam.page = 1;
  getList();
};
const onLoad = () => {
  if (logList.value.length < listParam.page) {
    return;
  }

  listParam.page++;
  getList();
};
const getList = () => {
  walletLogList(listParam)
    .then((res: any) => {
      const list = res.data?.list ?? [];
      if (listParam.page === 1) {
        logList.value = list;
      } else {
        logList.value = logList.value.concat(list);
      }
      refreshing.value = false;
      loadMore.value = false;
      finished.value =
        logList.value.length === 0 ||
        (logList.value.length >= res.data?.total ?? 0);
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
</script>
<style lang="scss" scoped>
.wallet-money-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  background-color: coral;
  border-radius: 4px;
  font-size: 14px;
  color: white;
}

.wallet-money {
  font-size: 32px;
}

.wallet-tab-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  text-align: center;
  background-color: white;
  filter: brightness(99%);
  box-shadow: -3px -3px 3px -2px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 14px;
  color: #333;
}

.wallet-tab-b {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  text-align: center;
  background-color: white;
  box-shadow: -3px -3px 3px -2px rgba(0, 0, 0, 0.05),
    3px -3px 3px -2px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  transform: scaleY(1.15);
  color: coral;
}

.wallet-tab-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background-color: white;
  filter: brightness(99%);
  box-shadow: -3px -3px 3px -2px rgba(0, 0, 0, 0.05),
    3px -3px 3px -2px rgba(0, 0, 0, 0.05);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 14px;
  color: #333;
}

.wallet-tab-span {
  transform: scaleY(1);
}

.wallet-tab-span-b {
  transform: scaleY(0.85);
}

.wallet-content {
  height: calc(100% - 280px);
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 30px;
  background-color: white;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: -3px 3px 3px -2px rgba(0, 0, 0, 0.05),
    3px 3px 3px -2px rgba(0, 0, 0, 0.05);
}

.wallet-radio {
  margin-top: 22px;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
}

.wallet-radio-weixin {
  flex: 1;
  text-align: right;
  font-size: 13px;
  color: #333;
}
.wallet-cash-title {
  margin-top: 26px;
  font-size: 16px;
  color: #333;
}

.wallet-input-container {
  margin-top: 12px;
  margin-left: 10px;
  margin-right: 10px;
}

.wallet-btn {
  width: auto;
  box-sizing: border-box;
  margin: 10px 40px;
  color: #fff;
  font-size: 14px;
  padding-left: 0;
  padding-right: 0;
}

.wallet-btn-hover {
  filter: brightness(90%);
}

.wallet-list-title {
  font-size: 16px;
  color: #333;
}

.wallet-list-money {
  font-size: 16px;
  color: #333;
  font-weight: 400;
}

.wallet-list-content {
  font-size: 12px;
  color: #999;
}
</style>

<template>
  <div class="page-container" style="text-align: center">
    <VanIcon
      name="checked"
      size="80px"
      color="#07c160"
      style="margin-top: 50px"
    ></VanIcon>
    <div style="font-size: 24px; color: #333; margin-top: 30px">提交成功</div>
    <div style="font-size: 13px; color: #999; margin: 8px 30px">
      提现单号:DDS{{
        sn
      }},请截屏保留,客服会通过微信号核实并提现至微信号;审核过程需要1个工作日。
    </div>
    <VanButton class="cash-btn" type="primary" @click="onConfirmClick">
      完成
    </VanButton>
  </div>
</template>
<script lang="ts" setup>
import { useOpenid } from "@/hooks/useOpenid";
import { useRoute, useRouter } from "vue-router";
useOpenid();
const route = useRoute();
const router = useRouter();
const sn = route.query.sn ?? "";
const onConfirmClick = () => {
  router.back();
};
</script>
<style lang="scss" scoped>
.cash-btn {
  margin-top: 30px;
  width: calc(100% - 60px);
  margin-left: 30px;
  margin-right: 30px;
}
</style>

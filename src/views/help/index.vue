<template>
  <div class="page-container">
    <van-collapse v-model="activeNames">
      <van-collapse-item title="一、如何查询优惠券" name="1">
        <div class="question-item">
          在淘宝、拼多多、或者京东看到的中意的商品
        </div>
        <div class="question-item">1、点击商品详情右上角···或者分享按钮；</div>
        <div class="question-item">2、复制商品链接</div>
        <div class="question-item">3、在公众号消息输入框【粘贴内容】发送</div>
        <div class="question-item">4、返回结果查看详情</div>
        <div class="question-item">5、点击【领券下单】自动跳转购买页面</div>
        <div class="question-item">6、点击【立即领取】</div>
        <div class="question-item">7、支付订单会自动抵扣优惠</div>
      </van-collapse-item>
      <van-collapse-item title="二、注意事项" name="2">
        <div class="question-item">
          1、商品不能加过购物车，需要从购物车内删除，然后再通过咱们的链接加购物车去下单。
        </div>
        <div class="question-item">
          2、下单请务必不要使用红包，否则无饭粒。红包可用在没有饭粒的商品上。
        </div>
        <div class="question-item">
          3、拼夕夕注意事项：查券之后，过1个小时再下单。这一个小时期间，不要浏览这个商品。否则饭粒为0。
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<script lang="ts" setup>
import { useOpenid } from "@/hooks/useOpenid";
import { ref } from "vue";

defineOptions({
  name: "Help",
});
useOpenid();
const activeNames = ref(["1", "2"]);
</script>
<style lang="scss" scoped></style>

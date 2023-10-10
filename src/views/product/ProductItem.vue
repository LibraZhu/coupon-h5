<template>
  <div class="product-item" @click="onProductClick">
    <img
      style="width: 150px; height: 150px; border-radius: 8px"
      :src="product.picurl"
    />
    <div class="product-content">
      <div class="product-title van-multi-ellipsis--l2">
        <img v-if="product.is_tmall" style="height: 14px" :src="icons[33]" />
        <img v-else style="width: 16px" :src="icons[product.source]" />
        {{ product.goods_name }}
      </div>
      <div>
        <div v-if="product.is_fen"></div>
        <div v-else-if="product.discountWph" style="display: inline-block">
          <div class="product-discount">{{ product.discountWph }}折</div>
          <div wx:if="{{product.discount!=='0'}}" class="product-coupon">
            {{ product.discount }}元券
          </div>
        </div>
        <div v-else class="product-coupon">
          {{ product.discount || "0" }}元券
        </div>
        <div
          v-if="product.rebate && product.rebate !== '0'"
          class="product-rebate"
        >
          返¥{{ product.rebate }}
        </div>
      </div>
      <div class="flex">
        <span class="product-price">原价{{ product.price }}</span>
        <span class="product-sales">
          {{ product.salesTip }}
        </span>
      </div>
      <div class="product-divider"><div></div></div>

      <div v-if="product.is_fen" class="product-price-after-tip">福利价</div>
      <div v-else-if="product.source == 5" class="product-price-after-tip">
        折扣价
      </div>
      <div v-else class="product-price-after-tip">券后价</div>
      <div class="product-price-after">
        <span>¥</span>{{ product.price_after }}
      </div>
      <VanButton class="product-button" color="#f9441c" size="small">
        领券抢购
      </VanButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Product } from "@/api/model";
import { SourceEnum } from "@/enum";
import { useImage } from "@/hooks/useImage";
import { Base64 } from "js-base64";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const { assets } = useImage();
const props = defineProps<{
  product: Product;
  from?: String;
}>();

const icons: Record<string, string> = {
  2: assets("jd.png"),
  1: assets("pdd.png"),
  4: assets("dy.png"),
  3: assets("tb.png"),
  5: assets("wph.png"),
  33: assets("tm.png"),
};
const onProductClick = () => {
  if (props.product.is_fen) {
    router.push({
      name: "ProductFenDetail",
      query: {
        data: Base64.encode(JSON.stringify(props.product)),
      },
    });
    return;
  }
  if (props.from === "collect") {
    router.push({
      name: "ProductDetail",
      query: {
        id: props.product.goods_id,
        sid: props.product.searchId,
        type: props.product.source,
      },
    });
    return;
  }
  if (
    props.product.source == SourceEnum.JD ||
    props.product.source == SourceEnum.TB
  ) {
    router.push({
      name: "ProductDetail",
      query: {
        data: Base64.encode(JSON.stringify(props.product)),
        type: props.product.source,
      },
    });
  } else {
    router.push({
      name: "ProductDetail",
      query: {
        id: props.product.goods_id,
        sid: props.product.searchId,
        type: props.product.source,
      },
    });
  }
};
</script>
<style lang="scss">
.product-item {
  display: flex;
  border-radius: 8px;
  padding: 7px;
  position: relative;

  .product-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .product-title {
    color: #333;
    font-size: 15px;
    font-weight: 500;
    margin: 4px 8px;
  }

  .product-discount {
    display: inline-block;
    text-align: center;
    width: 60px;
    height: 22px;
    margin-left: 10px;
    line-height: 22px;
    color: white;
    font-size: 14px;
    border-radius: 3px;
    background-color: #f5391a;
  }
  .product-coupon {
    display: inline-block;
    text-align: center;
    width: 60px;
    height: 22px;
    margin-left: 10px;
    line-height: 22px;
    color: white;
    font-size: 14px;
    border-radius: 3px;
    background: radial-gradient(circle at 0 11px, transparent 3px, #f5391a 3px)
        top left,
      linear-gradient(0.25turn, #f5391a, #f5391a),
      radial-gradient(circle at 10px 11px, transparent 3px, #f5391a 3px) bottom
        right;
    background-size: 10px 22px, 42px 22px, 10px 22px;
    background-repeat: no-repeat;
    background-position: 0px 0px, 9px 0px, 50px 0px;
  }

  .product-rebate {
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

  .product-price {
    flex: 1;
    color: #888;
    font-size: 12px;
    margin-top: 10px;
    margin-left: 10px;
    text-decoration: line-through;
  }

  .product-sales {
    color: #888;
    font-size: 12px;
    margin-top: 10px;
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
    font-size: 20px;
    font-weight: 500;
    margin-left: 10px;
    span {
      font-size: 12px;
    }
  }
  .product-button {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
</style>

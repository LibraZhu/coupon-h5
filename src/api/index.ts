import request from "@/api/request";
import { showToast } from "vant";
import { useAppStore } from "../store/modules/app";
import {
  CollectListParam,
  OrderListParam,
  PageParams,
  ProductDetailParam,
  ProductQueryParam,
  WalletCashParam,
  WalletModifyParam,
} from "./model";

export async function api(url: string, params: any, method: "POST" | "GET") {
  const appStore = useAppStore();
  if (!appStore.uid) {
    showToast("用户不存在");
    return;
  }
  return import.meta.env.PROD
    ? appStore.callCloud(url, method, params)
    : method === "GET"
    ? request.get(url, { params })
    : request.post(url, params);
}

//商品搜索
export const searchProductByLink = (keyword: string) =>
  api("/product/searchLink", { keyword }, "POST");
//商品列表
export const listProduct = (data: ProductQueryParam) =>
  api("/product/list", data, "POST");
//商品实时热销列表
export const hotProduct = (data: ProductQueryParam) =>
  api("/product/hotList", data, "POST");
//抖音一分购
export const oneFenProduct = (data: ProductQueryParam) =>
  api("/product/oneFenList", data, "POST");
//抖音一元购
export const oneYuanProduct = (data: ProductQueryParam) =>
  api("/product/oneYuanList", data, "POST");
//商品搜索
export const searchProduct = (data: ProductQueryParam) =>
  api("/product/search", data, "POST");
//商品超链
export const getLink = (data: ProductDetailParam) =>
  api("/product/link", data, "POST");
//一分购商品超链
export const getFenLink = (data: ProductDetailParam) =>
  api("/product/fenLink", data, "POST");
//商品详情
export const productDetail = (data: ProductDetailParam) =>
  api("/product/detail", data, "POST");
//pdd商品搜索
export const searchProductPdd = (data: ProductQueryParam) =>
  api("/product/search/pdd", data, "POST");
//商品是否收藏
export const collectCheck = (productId: string) =>
  api("/collect/check", { productId }, "POST");
//收藏商品列表
export const listCollectProduct = (data: CollectListParam) =>
  api("/collect/list", data, "POST");
//商品收藏操作
export const collectHandle = (
  productId: string,
  collect: boolean,
  product: string
) => api("/collect/handle", { productId, collect, product }, "POST");
//订单列表
export const orderList = (data: OrderListParam) =>
  api("/order/list", data, "POST");
//钱包信息
export const walletInfo = () => api("/wallet/info", {}, "POST");
export const walletModify = (data: WalletModifyParam) =>
  api("/wallet/info/modify", data, "POST");
//钱包余额信息
export const walletNumber = () => api("/wallet/number", {}, "POST");
//提现
export const walletRecordCash = (data: WalletCashParam) =>
  api("/wallet/record/cash", data, "POST");
//提现记录
export const walletCashList = (page: PageParams) =>
  api("/wallet/record/cashList", page, "POST");
//结算记录
export const walletSettleList = (page: PageParams) =>
  api("/wallet/record/settleList", page, "POST");
//钱包明细
export const walletLogList = (page: PageParams) =>
  api("/wallet/log/list", page, "POST");
//外卖-美团
export const meituan = (type?: number) =>
  api("/jtk/meituan", { type: type ?? 1 }, "GET");
//外卖-饿了么
export const ele = (type?: number) =>
  api("/jtk/ele", { type: type ?? 4 }, "GET");
//pdd-话费充值
export const phoneBill = (type?: number) =>
  api("/jtk/phoneBill", { type: type ?? 4 }, "GET");
//统一活动转链接口
export const unionLink = (type?: number) =>
  api("/jtk/unionLink", { type: type }, "GET");
//淘宝授权查询
export const tbRelation = () => api("/user/tbRelation", {}, "POST");

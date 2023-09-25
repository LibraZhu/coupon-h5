import request from "@/api/request";
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

export async function post(url: string, data: any) {
  const appStore = useAppStore();
  if (appStore.uid) {
    return request.post(url, data);
  } else {
    const res = await request.post("/user/loginG", {
      gOpenid: appStore.gOpenid,
    });
    if (res && res.code === 200) {
      appStore.setUid(res.data.id);
      return request.post(url, data);
    }
    return res;
  }
}

export async function get(url: string, params: any) {
  const appStore = useAppStore();
  if (appStore.uid) {
    return request.get(url, { params });
  } else {
    const res = await request.post("/user/loginG", {
      gOpenid: appStore.gOpenid,
    });
    if (res && res.code === 200) {
      appStore.setUid(res.data.id);
      return request.get(url, { params });
    }
    return res;
  }
}

//商品搜索
export const searchProductByLink = (keyword: string) =>
  post("/product/searchLink", { keyword });
//商品列表
export const listProduct = (data: ProductQueryParam) =>
  post("/product/list", data);
//商品实时热销列表
export const hotProduct = (data: ProductQueryParam) =>
  post("/product/hotList", data);
//商品搜索
export const searchProduct = (data: ProductQueryParam) =>
  post("/product/search", data);
//商品超链
export const getLink = (data: ProductDetailParam) =>
  post("/product/link", data);
//商品详情
export const productDetail = (data: ProductDetailParam) =>
  post("/product/detail", data);
//pdd商品搜索
export const searchProductPdd = (data: ProductQueryParam) =>
  post("/product/search/pdd", data);
//商品是否收藏
export const collectCheck = (productId: string) =>
  post("/collect/check", { productId });
//收藏商品列表
export const listCollectProduct = (data: CollectListParam) =>
  post("/collect/list", data);
//商品收藏操作
export const collectHandle = (
  productId: string,
  collect: boolean,
  product: string
) => post("/collect/handle", { productId, collect, product });
//订单列表
export const orderList = (data: OrderListParam) => post("/order/list", data);
//钱包信息
export const walletInfo = () => post("/wallet/info", {});
export const walletModify = (data: WalletModifyParam) =>
  post("/wallet/info/modify", data);
//钱包余额信息
export const walletNumber = () => post("/wallet/number", {});
//提现
export const walletRecordCash = (data: WalletCashParam) =>
  post("/wallet/record/cash", data);
//提现记录
export const walletCashList = (page: PageParams) =>
  post("/wallet/record/cashList", page);
//结算记录
export const walletSettleList = (page: PageParams) =>
  post("/wallet/record/settleList", page);
//钱包明细
export const walletLogList = (page: PageParams) =>
  post("/wallet/log/list", page);
//外卖-美团
export const meituan = (type?: number) =>
  get("/jtk/meituan", { type: type ?? 1 });
//外卖-饿了么
export const ele = (type?: number) => get("/jtk/ele", { type: type ?? 4 });
//统一活动转链接口
export const unionLink = (type?: number) =>
  get("/jtk/unionLink", { type: type });

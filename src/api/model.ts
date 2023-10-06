export interface PageParams {
  page: number;
  pageSize: number;
}
export interface ProductQueryParam extends PageParams {
  source?: number; //来源：1->pdd; 2->jd; 3->tb; 4->dy; 5->wph
  optId?: number; //pdd:商品类目ID; jd:频道ID
  listId?: string; //pdd/tb:用于翻页时锁定唯一的商品列表，请求商品分页数=1时非必填，请求商品分页数>1时必填
  jxCode?: string; //wph:精选组货码
  sortType?: number; //0-综合排序;3-按价格升序;4-按价格降序;5-按销量升序;6-按销量降序;9-券后价升序排序;10-券后价降序排序
  keyword?: string; //关键字
}
export interface ProductDetailParam {
  productId?: string;
  searchId?: string;
  source?: number; // 来源：1->pdd; 2->jd; 3->tb; 4->dy; 5->wph
  couponUrl?: string;
}
export interface WalletCashParam {
  money: string;
  account: string;
  payType: number;
}
export interface WalletModifyParam {
  bank?: string;
  bankName?: string;
  name?: string;
  weixin?: string;
}
export interface CollectListParam extends PageParams {}
export interface OrderListParam extends PageParams {
  status?: number | null;
}
export interface Result<T> {
  code: number;
  data?: T;
  msg?: string;
}
export interface CommonPage<T> {
  page: number;
  pageSize: number;
  totalPage?: number;
  total: number;
  list: Array<T>;
}
export interface Product {
  source: number;
  goods_id: string;
  goods_name?: string;
  goods_short_name?: string;
  goods_desc?: string;
  goods_url?: string;
  price: string;
  price_after: string;
  discount: string;
  rebate?: string;
  picurl?: string;
  picurls?: string;
  couponurl?: string;
  sales?: number;
  salesTip?: string;
  owner?: string;
  comments?: number;
  ispg?: string;
  is_tmall?: boolean;
  discountWph?: string;
  searchId?: string;
}
export interface Order {
  id: number;
  orderSource: number;
  orderId?: string;
  orderSn?: string;
  orderTime: string;
  modifyTime?: string;
  finishTime?: string;
  settlementTime?: string;
  orderEmt?: number;
  plus?: number;
  compared?: number;
  skuId?: string;
  skuName?: string;
  skuNum?: number;
  imageUrl?: string;
  price?: string;
  priceTotal?: string;
  rebate?: string;
  status?: number;
  uid?: string;
  statusDes?: string;
}
export interface WalletLog {
  id: number;
  recordSn?: string;
  changeMoney?: string;
  money: string;
  des?: string;
  createTime?: string;
}
export interface WalletRecord {
  id: number;
  recordSn?: string;
  money: string;
  payType: number;
  payAccount?: string;
  remark?: string;
  payStatus?: number;
  payTime?: string;
  createTime?: string;
  settlePeriod?: string;
  settleOrderId?: string;
}
export interface SysConfig {
  id: number;
  cName: string;
  cCode: string;
  cValue: string;
}

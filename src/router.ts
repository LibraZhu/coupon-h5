import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    name: "notFound",
    path: "/:path(.*)+",
    redirect: {
      name: "Home",
    },
  },
  {
    path: "/",
    redirect: {
      name: "Home",
    },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          tabbar: true,
          noNavBar: true,
        },
      },
      {
        path: "mine",
        name: "Mine",
        component: () => import("@/views/mine/index.vue"),
        meta: {
          title: "我的",
          tabbar: true,
          noNavBar: true,
        },
      },
      {
        path: "search",
        name: "Search",
        component: () => import("@/views/search/index.vue"),
        meta: {
          title: "查返利",
          tabbar: true,
          noNavBar: true,
        },
      },
    ],
  },
  {
    path: "/product",
    children: [
      {
        path: "detail",
        name: "ProductDetail",
        component: () => import("@/views/product/ProductDetail.vue"),
        meta: {
          title: "商品详情",
          noNavBar: true,
          noCache: true,
        },
      },
      {
        path: "list",
        name: "ProductList",
        component: () => import("@/views/product/ProductList.vue"),
        meta: {
          title: "商品列表",
          noNavBar: true,
        },
      },
    ],
  },
  {
    path: "/wallet",
    children: [
      {
        path: "index",
        name: "Wallet",
        component: () => import("@/views/wallet/index.vue"),
        meta: {
          title: "钱包",
        },
      },
      {
        path: "cash/result",
        name: "CashResult",
        component: () => import("@/views/wallet/CashResult.vue"),
        meta: {
          title: "提现",
        },
      },
      {
        path: "cash/record",
        name: "CashRecord",
        component: () => import("@/views/wallet/CashRecord.vue"),
        meta: {
          title: "提现记录",
        },
      },
    ],
  },
  {
    path: "/order",
    children: [
      {
        path: "index",
        name: "Order",
        component: () => import("@/views/order/index.vue"),
        meta: {
          title: "我的订单",
        },
      },
    ],
  },
  {
    path: "/help",
    children: [
      {
        path: "index",
        name: "Help",
        component: () => import("@/views/help/index.vue"),
        meta: {
          title: "帮助中心",
        },
      },
    ],
  },
  {
    path: "/setting",
    children: [
      {
        path: "index",
        name: "Setting",
        component: () => import("@/views/setting/index.vue"),
        meta: {
          title: "设置",
        },
      },
    ],
  },
  {
    path: "/collect",
    children: [
      {
        path: "index",
        name: "Collect",
        component: () => import("@/views/collect/index.vue"),
        meta: {
          title: "我的收藏",
        },
      },
    ],
  },
  {
    path: "/search",
    children: [
      {
        path: "list",
        name: "SearchList",
        component: () => import("@/views/search/SearchList.vue"),
        meta: {
          title: "查询",
          noNavBar: true,
        },
      },
    ],
  },
  {
    path: "/hot",
    children: [
      {
        path: "index",
        name: "Hot",
        component: () => import("@/views/hot/index.vue"),
        meta: {
          title: "实时热销榜",
          noNavBar: true,
        },
      },
    ],
  },
  {
    path: "/local",
    children: [
      {
        path: "meituan",
        name: "MeiTuan",
        component: () => import("@/views/local/MeiTuan.vue"),
        meta: {
          title: "美团外卖",
          navBarColor: "#ffe262",
        },
      },
      {
        path: "ele",
        name: "Ele",
        component: () => import("@/views/local/Ele.vue"),
        meta: {
          title: "饿了么外卖",
          navBarColor: "#3590f1",
        },
      },
      {
        path: "taxi",
        name: "Taxi",
        component: () => import("@/views/local/Taxi.vue"),
        meta: {
          title: "打车",
          noNavBar: true,
        },
      },
    ],
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
  const title = to?.meta?.title;
  if (title) {
    document.title = title as string;
  }
  if (from.query.uid) {
    to.query.uid = from.query.uid;
    to.fullPath =
      to.fullPath.indexOf("?") == -1
        ? `${to.fullPath}?uid=${from.query.uid}`
        : `${to.fullPath}&uid=${from.query.uid}`;
  }
  if (from.query.gOpenid) {
    to.query.gOpenid = from.query.gOpenid;
    to.fullPath =
      to.fullPath.indexOf("?") == -1
        ? `${to.fullPath}?gOpenid=${from.query.gOpenid}`
        : `${to.fullPath}&gOpenid=${from.query.gOpenid}`;
  }
  next();
});

export default router;

<template>
  <div class="page-container">
    <van-cell-group>
      <van-cell title="头像" icon="user-o">
        <template #right-icon>
          <van-image width="36" height="36" :src="assets('avatar.png')" />
        </template>
      </van-cell>
      <van-cell title="昵称" value="微信用户" icon="contact" />
    </van-cell-group>
    <van-cell
      style="margin-top: 10px"
      title="版本"
      value="v1.0.0"
      icon="setting-o"
    />
  </div>
</template>
<script lang="ts" setup>
import { useImage } from "@/hooks/useImage";
import { useOpenid } from "@/hooks/useOpenid";

defineOptions({
  name: "Setting",
});
useOpenid();
const { assets } = useImage();
</script>
<style lang="scss" scoped></style>

<template></template>
<script lang="ts" setup>
import { useApp } from "@/hooks/useApp";
import { useRoute } from "vue-router";
useApp();
const route = useRoute();
const url = decodeURIComponent(route.query.url?.toString() ?? "");
console.log(url);

window.location.href = url;
</script>
<style lang="scss" scoped></style>

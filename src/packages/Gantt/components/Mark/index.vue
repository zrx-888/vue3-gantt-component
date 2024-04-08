<template>
  <div className="gantt-right-body-content-mark">
    <div
      v-for="(item, index) in props.days"
      :key="index"
      class="gantt-right-body-content-mark-item"
      :style="{
        width: props.width * item.length + 'px',
        minWidth: props.width * item.length + 'px',
        height: props.bodyRect.scrollHeight
          ? props.bodyRect.scrollHeight + 'px'
          : '100%',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { YearListIF, BodyRectProps } from "../../types.vue";
interface Props {
  days: YearListIF[];
  width: number;
  bodyRect: BodyRectProps;
}
const props = defineProps<Props>();
</script>

<style scoped></style>

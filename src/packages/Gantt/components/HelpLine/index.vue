<template>
  <!-- 开始时间  -->
  <div
    :class="`helpLine-line helpLine-line-${props.item.status}`"
    :style="{
      top: rect.top + 'px',
      left: props.item.left + 5 + 'px',
      height: rect.height + 'px',
    }"
  ></div>

  <!-- 结束时间  -->
  <div
    :class="`helpLine-line helpLine-line-${props.item.status}`"
    :style="{
      left: props.item.left + 5 + props.item.width + 'px',
      top: rect.top + 'px',
      height: rect.height + 'px',
    }"
  ></div>

  <!-- 超时红线  -->
  <div
    v-if="
      (props.item.status === 'finishOvertime' ||
        props.item.status === 'overtime') &&
      props.item.overtimeWidth
    "
    :class="`helpLine-line helpLine-line-${props.item.status}`"
    :style="{
      top: rect.top + 'px',
      borderColor: '#f54040',
      left:
        props.item.left +
        rect.left +
        5 +
        props.item.width +
        props.item.overtimeWidth +
        'px',
      height: rect.height + 'px',
    }"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from "vue";
import { IListIF } from "../../types.vue";
interface Props {
  item: IListIF;
  ganttProgressBarId: string;
}
const props = defineProps<Props>();
const rect = reactive({
  top: 0,
  left: 0,
  bottom: 0,
  height: 0,
});

onUnmounted(() => {
  const elements = document.getElementsByClassName("progressBar");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.classList.remove("gantt-animation");
  }
  // @ts-ignore
  document.getElementById("top-time-width").innerHTML = "";
});

onMounted(() => {
  const rightBodyDom = document.getElementById("gantt-right-body-content");
  const ganttProgressBarDom = document.getElementById(
    props.item.ganttProgressBarId
  );
  if (rightBodyDom && ganttProgressBarDom) {
    const top =
      rightBodyDom.getBoundingClientRect().top -
      ganttProgressBarDom.getBoundingClientRect().top;
    rect.top = top - 1;
    rect.height = rightBodyDom.clientHeight || 0;
  }

  const elements = document.getElementsByClassName("progressBar");
  // @ts-ignore
  document.getElementById("top-time-width").innerHTML = `
    <div class="top-time-width-item" style="left:${props.item.left + 5}px;">
      <div class="top-time-width-item-child" style="width:${
        props.item.width + 1
      }px; background:var(--${
    props.item.status === "overtime" ? "progress" : props.item.status
  }Color)"></div>
      ${
        (props.item.status === "finishOvertime" ||
          props.item.status === "overtime") &&
        props.item.overtimeWidth
          ? `<div style="width:${props.item.overtimeWidth}px; background:var(--overtimeColor)"></div>`
          : ""
      } 
    </div>`;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.id != props.ganttProgressBarId) {
      element.classList.add("gantt-animation");
    }
  }
});
</script>

<style scoped></style>

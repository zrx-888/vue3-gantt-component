<template>
  <div class="gantt-right-body-cell gantt-right-body-cell-isParent-false">
    <div
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      :id="'gantt-progressBar-Id' + index"
      :class="`progressBar progressBar-${props.item.status}`"
      :style="{
        padding: '5px',
        border: '0',
        background: 'transparent',
        left: props.item.left + 'px',
      }"
    >
      <div class="progressBar-box">
        <div class="progressBar-render progressBar-render-child">
          <slot
            name="childrenSlot"
            v-bind="{
              ...item,
              width: item.width,
              activeWidth: item.width * item.progress,
              surplusWidth: item.width - item.width * item.progress,
              overflowWidth: item.overtimeWidth,
            }"
          ></slot>
        </div>
        <div
          class="progressBar-default progressBar-default-child"
          :style="{ width: props.item.width + 'px' }"
        >
          <div
            class="progressBar-active progressBar-active-child"
            :style="{
              width: props.item.progress * 100 + '%',
            }"
          ></div>
        </div>
        <div
          v-if="
            (props.item.status === 'overtime' ||
              props.item.status === 'finishOvertime') &&
            props.item.overtimeWidth
          "
          class="progressBar-overTimeWidth progressBar-overTimeWidth-child"
          :style="{
            width: props.item.overtimeWidth + 'px',
          }"
        >
          <div class="overtimeRender"></div>
        </div>
      </div>
    </div>

    <template
      v-if="
        props.showLine &&
        ganttProgressBarId === `gantt-progressBar-Id${props.index}`
      "
    >
      <HelpLine
        :ganttProgressBarId="ganttProgressBarId"
        :item="{
          ...item,
          ganttProgressBarId: `gantt-progressBar-Id${props.index}`,
        }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IListIF } from "../../types.vue";
import HelpLine from "../HelpLine/index.vue";

interface Props {
  item: IListIF;
  index: number;
  showLine: boolean;
  ganttProgressBarId: string;
}
const props = defineProps<Props>();

const ganttProgressBarId = ref("");

const handleMouseenter = () => {
  ganttProgressBarId.value = `gantt-progressBar-Id${props.index}`;
};

const handleMouseleave = () => {
  ganttProgressBarId.value = "";
};
</script>

<style scoped></style>

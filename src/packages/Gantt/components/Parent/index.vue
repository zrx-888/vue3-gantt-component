<template>
  <div class="gantt-right-body-cell gantt-right-body-cell-isParent-true">
    <div
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      :id="`gantt-progressBar-Id${props.index}`"
      :class="`progressBar progressBar-${props.item.status}`"
      :style="{
        left: props.item.left + 'px',
      }"
    >
      <div class="progressBar-box">
        <div class="progressBar-render">
          <slot
            name="parentSlot"
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
          class="progressBar-default"
          :style="{
            width: props.item.width + 'px',
          }"
        >
          <div
            class="progressBar-active"
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
          class="progressBar-overTimeWidth"
          :style="{
            width: props.item.overtimeWidth + 'px',
          }"
        >
          <div class="overtimeRender"></div>
        </div>
      </div>
      <div class="progress-text" @click="handleClickText">
        {{ statusList.filter((e) => props.item.status === e.status)[0].text }}
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
import { GanttDataProps, GanttStatusListProps, IListIF } from "../../types.vue";
import HelpLine from "../HelpLine/index.vue";
interface EmitProps {
  (e: "onClickText", params: GanttDataProps): void;
}
const emit = defineEmits<EmitProps>();
interface Props {
  item: IListIF;
  index: number;
  showLine: boolean;
  statusList: GanttStatusListProps[];
}
const props = defineProps<Props>();
const ganttProgressBarId = ref("");

const handleClickText = () => {
  emit("onClickText", props.item);
};
const handleMouseenter = () => {
  ganttProgressBarId.value = `gantt-progressBar-Id${props.index}`;
};

const handleMouseleave = () => {
  ganttProgressBarId.value = "";
};
</script>

<style scoped></style>

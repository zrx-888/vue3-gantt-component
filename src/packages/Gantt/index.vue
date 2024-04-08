<template>
  <div
    className="gantt"
    :style="{
      height: height,
    }"
  >
    <Table
      :head="props.head"
      :list="props.data"
      :openStatus="openStatus"
      :open="props.open"
      :headBodyPaddingY="props.headBodyPaddingY"
      :headBodyPaddingX="props.headBodyPaddingX"
      :headWidth="props.headWidth"
      :scrollBarHeight="scrollBarHeight"
      @onChange="onChange"
    />

    <TimeData
      ref="timeDataRef"
      :showLine="props.showLine"
      :ganttType="myGanttType"
      :list="props.data"
      :headBodyPaddingY="props.headBodyPaddingY"
      @onChangeScrollBarHeight="onChangeScrollBarHeight"
      @onClickText="onClickText"
    >
      <template #parentSlot="row">
        <slot name="parentSlot" v-bind="row"></slot>
      </template>
      <template #childrenSlot="row">
        <slot name="childrenSlot" v-bind="row"></slot>
      </template>
    </TimeData>
    <Types />
  </div>
</template>

<script setup lang="ts">
import Types from "./types.vue";
import { ref } from "vue";
import Table from "./Table.vue";
import TimeData from "./TimeData.vue";
import "./index.css";
import {
  GanttDataProps,
  GanttProps,
  GanttHeadProps,
  GanttType,
} from "./types.vue";

interface MyProps extends GanttProps {
  data: GanttDataProps[];
  head: GanttHeadProps[];
}

const emit = defineEmits<{
  (e: "onClickText", params: GanttDataProps): void;
}>();
const props = withDefaults(defineProps<MyProps>(), {
  headWidth: "400px",
  height: "auto",
  ganttType: "day",
  headBodyPaddingY: 10,
  headBodyPaddingX: 0,
  showLine: true,
  open: true,
});
const timeDataRef = ref<{
  initList: () => void;
}>();
const scrollBarHeight = ref(0);
const openStatus = ref(true);
const myGanttType = ref(props.ganttType);

// 展开收起
const onChange = () => {
  openStatus.value = !openStatus.value;
  setTimeout(() => {
    timeDataRef.value?.initList();
  }, 300);
};

const onClickText = (e: GanttDataProps) => {
  emit("onClickText", e);
};
const onChangeScrollBarHeight = (e: number) => {
  scrollBarHeight.value = e;
};

// 初始化
const initGantt = (time?: 0) => {
  setTimeout(() => {
    timeDataRef.value?.initList();
  }, time);
};

// 切换类型
const setGanttType = (type: GanttType) => {
  myGanttType.value = type;
  setTimeout(() => {
    timeDataRef.value?.initList();
  });
};
defineExpose({
  setGanttType,
  initGantt,
});
</script>

<style scoped></style>

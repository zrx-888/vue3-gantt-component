<script setup lang="ts">
import { ref } from "vue";
import type {
  GanttDataProps,
  GanttHeadProps,
  GanttRefProps,
} from "vue3-gantt-component";
import Gantt from "vue3-gantt-component";
const list: GanttDataProps[] = [
  {
    startTime: "2024-3-10 00:00:00",
    endTime: "2024-3-15 00:00:00",
    finishTime: null,
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
  },
  {
    startTime: "2024-03-01 00:00:00",
    endTime: "2024-04-01 00:00:00",
    finishTime: "2024-03-22 00:00:00",
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
    children: [
      {
        start: false,
        startTime: "2024-03-22 00:00:00",
        endTime: "2024-04-29 12:00:00",
        finishTime: null,
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
    ],
  },
  {
    startTime: "2024-03-11 00:00:00",
    endTime: "2024-03-25 12:00:00",
    finishTime: "2024-03-22 12:00:00",
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
  },
  {
    startTime: "2024-03-07 00:00:00",
    endTime: "2024-03-27 12:00:00",
    finishTime: null,
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
  },
  {
    startTime: "2024-03-11 00:00:00",
    endTime: "2024-03-20 12:00:00",
    finishTime: "2024-03-27 00:00:00",
    dept: "技术部",
    num: "2人",
    time: "2天",
    start: true,
    time2: "结束时间",
    children: [
      {
        start: true,
        startTime: "2024-03-12 00:00:00",
        endTime: "2024-03-19 12:00:00",
        finishTime: "2024-03-25 12:00:00",
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
      {
        start: true,
        startTime: "2024-03-13 00:00:00",
        endTime: "2024-03-24 17:00:00",
        finishTime: "2024-03-29 12:00:00",
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
      {
        start: true,
        startTime: "2024-04-13 09:00:00",
        endTime: "2024-04-15 17:00:00",
        finishTime: null,
        dept: "前端",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },

      {
        start: false,
        startTime: "2024-04-13 09:00:00",
        endTime: "2024-04-15 17:00:00",
        finishTime: null,
        dept: "前端手收尸",
        num: "2人",
        time: "2天",
        time2: "结束时间",
      },
    ],
  },
];

const head: GanttHeadProps[] = [
  {
    title: "部门",
    key: "dept",
    align: "left",
  },
  {
    title: "人数",
    key: "num",
  },
  {
    title: "已用工时",
  },
  {
    title: "任务时间",
  },
];

const show = ref(true);
const ganttRef = ref<GanttRefProps>();
const handleChange = () => {
  show.value = !show.value;
  ganttRef.value?.setGanttType(show.value ? "day" : "month");
};

const onClickText = (e: GanttDataProps) => {
  console.log(e);
};
</script>

<template>
  <div style="padding: 20px">
    <button @click="handleChange">切换显示</button>
    <Gantt
      :head="head"
      :data="list"
      ref="ganttRef"
      @on-click-text="onClickText"
    >
      <template #parentSlot="{ activeWidth, overflowWidth }">
        <div style="display: flex">
          <div :style="{ width: activeWidth + 'px' }">
            我的宽度是：{{ activeWidth }}px
          </div>
          <div :style="{ width: overflowWidth + 'px' }" v-if="overflowWidth">
            我的宽度是：{{ overflowWidth && overflowWidth.toFixed(2) }}px
          </div>
        </div>
      </template>

      <template #childrenSlot="{ width }">
        <div style="display: flex">
          <div :style="{ width: width + 'px' }">{{ width.toFixed(0) }}px</div>
        </div>
      </template>
    </Gantt>
  </div>
</template>

<style scoped></style>

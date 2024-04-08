<template>
  <div class="gantt-right" id="gantt-right">
    <div
      class="gantt-right-body"
      id="gantt-right-body"
      :style="{ width: headWidth + 'px' }"
    >
      <div class="gantt-right-body-head-box">
        <div class="gantt-right-body-head">
          <div id="top-time-width"></div>
          <div class="gantt-right-body-head-list gantt-right-body-head-year">
            <div
              v-for="(item, index) in yaerList"
              :key="index"
              :style="{
                width: width * item.length + 'px',
                minWidth: width * item.length + 'px',
              }"
              class="gantt-right-body-head-year-item"
            >
              {{ item.year }}
            </div>
          </div>
          <div class="gantt-right-body-head-list">
            <div
              v-for="(item, index) in days"
              :key="index"
              :style="{
                width: width * item.length + 'px',
                minWidth: width * item.length + 'px',
              }"
              class="gantt-right-head-item-day"
            >
              {{
                ganttType === "day"
                  ? item.year.split("-")[2]
                  : item.year.split("-")[1]
              }}
            </div>
          </div>
        </div>
        <div
          class="gantt-right-head-scrollBarWidth"
          :style="{ width: bodyRect.scrollWidth + 'px' }"
        ></div>
      </div>

      <div class="gantt-right-body-body">
        <div style="flex: 1; overflow: hidden">
          <div
            class="gantt-right-body-content"
            ref="bodyContentRef"
            @scroll="handleScroll"
            id="gantt-right-body-content"
          >
            <Mark
              v-if="data.length"
              :days="days"
              :width="width"
              :bodyRect="bodyRect"
            />
            <div
              class="gantt-right-body-cell"
              :style="{
                height: props.headBodyPaddingY + 'px',
              }"
            ></div>
            <div v-for="(item, index) in data" :key="item.ganttId">
              <div
                v-if="item.isEmpty"
                class="gantt-right-body-cell gantt-right-body-cell-isEmpty"
              ></div>
              <div
                v-else-if="item.parentIsEmpty"
                class="gantt-right-body-cell gantt-right-body-cell-parentIsEmpty"
              ></div>
              <template v-else-if="!item.isParent">
                <Children
                  :item="item"
                  :index="index"
                  :showLine="props.showLine"
                  :ganttProgressBarId="ganttProgressBarId"
                >
                  <template #childrenSlot="row">
                    <slot name="childrenSlot" v-bind="row"></slot>
                  </template>
                </Children>
              </template>
              <template v-else-if="item.isParent">
                <Parent
                  :item="item"
                  :index="index"
                  :showLine="props.showLine"
                  :ganttProgressBarId="ganttProgressBarId"
                  :statusList="statusList"
                  @on-click-text="handleClickText"
                >
                  <template #parentSlot="row">
                    <slot name="parentSlot" v-bind="row"></slot>
                  </template>
                </Parent>
              </template>
            </div>
            <div
              class="gantt-right-body-cell"
              :style="{
                height: props.headBodyPaddingY + 'px',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import {
  getStartEndHours,
  getYearMonth,
  getDaysList,
  initGantt,
  defaultStatus,
  debounce,
  calculateScrollbarWidth,
} from "./help";
import Parent from "./components/Parent/index.vue";
import Children from "./components/Children/index.vue";
import Mark from "./components/Mark/index.vue";
import {
  GanttDataProps,
  GanttStatusListProps,
  YearListIF,
  IListIF,
  GanttType,
} from "./types.vue";

interface MaxMinDate {
  startDate: string;
  endDate: string;
}
interface EmitProps {
  (e: "onChangeScrollBarHeight", params: number): void;
  (e: "onClickText", params: GanttDataProps): void;
}
interface Props {
  list: GanttDataProps[];
  headBodyPaddingY: number;
  showLine: boolean;
  ganttType: GanttType;
  statusList?: GanttStatusListProps[];
}

const props = withDefaults(defineProps<Props>(), {
  statusList: () => defaultStatus,
});

const emit = defineEmits<EmitProps>();

const yaerList = ref<YearListIF[]>([]); // 顶部第一行数据
const days = ref<YearListIF[]>([]); // 顶部第二行数据
const data = ref<IListIF[]>([]);
const width = ref(0); //每一个节点的宽度
const headWidth = ref(0); //总宽度
// hover选中的ID
const ganttProgressBarId = ref("");
const bodyContentRef = ref();
const bodyRect = reactive({
  height: 0,
  scrollWidth: 0,
  scrollHeight: 0,
});

const handleScroll = (event: any) => {
  if (event && event.target) {
    document.getElementsByClassName("gantt-right-body-head")[0].scrollLeft =
      event.target.scrollLeft;
    document.getElementsByClassName("ganttOverview-body-height")[0].scrollTop =
      event.target.scrollTop;
  }
};

const handleClickText = (item: GanttDataProps) => {
  emit("onClickText", item);
};

// 计算显示位置
const resetPosition = (
  chunkWidth: number,
  maxMinDate: MaxMinDate,
  newList: IListIF[]
) => {
  const itemWidthEqually = chunkWidth / 24;
  const newData = newList.map((e) => {
    const endDate = dayjs(e.startTime);
    const numDays = endDate.diff(maxMinDate.startDate, "day");
    const startHours = new Date(e.startTime).getHours();
    let progressHours = getStartEndHours("", e.startTime);
    const endHours = getStartEndHours(e.endTime, e.startTime);
    let overtimeHours = 0;
    if (e.status === "finishOvertime") {
      progressHours = endHours;
      overtimeHours = e.finishTime
        ? getStartEndHours(e.finishTime, e.endTime)
        : 0;
    } else if (e.status === "overtime") {
      progressHours = endHours;
      overtimeHours = getStartEndHours("", e.endTime);
    } else if (e.status === "finish") {
      progressHours = e.finishTime
        ? getStartEndHours(e.finishTime, e.startTime)
        : 0;
    } else if (e.status === "wait") {
      progressHours = endHours;
    } else {
      if (new Date(e.startTime).getTime() > new Date().getTime()) {
        progressHours = 0;
      } else {
        progressHours = getStartEndHours("", e.startTime);
      }
    }
    const progress = progressHours / endHours;

    return {
      ...e,
      startTime: e.startTime,
      endTime: e.endTime,
      finishTime: e.finishTime,
      overtimeWidth: overtimeHours * itemWidthEqually,
      progress: progress,
      status: e.status,
      width: endHours * itemWidthEqually,
      left: numDays * chunkWidth + startHours * itemWidthEqually - 5,
    };
  });
  data.value = newData;
  nextTick(() => {
    const barHeight =
      bodyContentRef.value.offsetHeight - bodyContentRef.value.clientHeight;
    bodyRect.scrollHeight =
      bodyContentRef.value.scrollHeight > bodyContentRef.value.clientHeight
        ? bodyContentRef.value.scrollHeight
        : 0;
    bodyRect.height = bodyContentRef.value.offsetHeight;
    bodyRect.scrollWidth =
      bodyContentRef.value.offsetWidth - bodyContentRef.value.clientWidth;
    emit("onChangeScrollBarHeight", barHeight);
  });
};

// 使用函数

// 计算顶部最多显示多少个
const resetSize = (maxMinDate: MaxMinDate, newList: IListIF[]) => {
  const offsetWidth = document.getElementById("gantt-right")?.offsetWidth;
  let contentHeight = props.headBodyPaddingY * 2;
  newList.forEach((item) => {
    contentHeight += item.height;
  });

  if (offsetWidth) {
    const offsetHeight = bodyContentRef.value.offsetHeight;
    const scrollbarWidth = calculateScrollbarWidth();
    const contentWidth =
      contentHeight > offsetHeight ? offsetWidth - scrollbarWidth : offsetWidth;
    const year = getYearMonth(
      maxMinDate.startDate,
      maxMinDate.endDate,
      props.ganttType
    );
    let domWidth = 0;
    yaerList.value = year;

    if (props.ganttType === "day") {
      const day = getDaysList(maxMinDate.startDate, maxMinDate.endDate);

      const itemWidth = contentWidth / day.length;
      domWidth = itemWidth > 40 ? itemWidth : 40;
      const newDay = day.map((e) => {
        return {
          year: e,
          length: 1,
        };
      });
      days.value = newDay;
    } else if (props.ganttType === "month") {
      let allDayNum = 0;
      year.forEach((item) => (allDayNum += item.length));
      const itemWidth = contentWidth / allDayNum;
      domWidth = itemWidth > 3 ? itemWidth : 3;
      const noRepeatYear: { [key: string]: YearListIF } = {};
      const showYear: YearListIF[] = [];
      year.forEach((item) => {
        const year = Number(item.year.split("-")[0]);
        const month = Number(item.year.split("-")[1]);
        if (noRepeatYear[year]) {
          noRepeatYear[year].length += new Date(year, month, 0).getDate();
        } else {
          noRepeatYear[year] = {
            length: new Date(year, month, 0).getDate(),
            year: item.year.slice(0, 4),
          };
        }
      });
      for (const key in noRepeatYear) {
        showYear.push(noRepeatYear[key]);
      }
      days.value = year;
      yaerList.value = showYear;
    }
    // 计算位置
    headWidth.value = offsetWidth;
    resetPosition(domWidth, maxMinDate, newList);
    width.value = domWidth;
  }
};

// 初始数组的处理
const initList = () => {
  data.value = [];
  const listTime = initGantt(props.list);
  let isOvertime = false;
  listTime.forEach((item) => {
    if (item.start) {
      const startTime = new Date(item.startTime).getTime();
      const endTime = new Date(item.endTime).getTime();
      const finishTime = item.finishTime
        ? new Date(item.finishTime).getTime()
        : null;
      if (!finishTime) {
        if (new Date().getTime() > endTime) {
          item.status = "overtime";
          isOvertime = true;
        } else {
          item.status = "progress";
        }
      } else if (startTime < finishTime && finishTime <= endTime) {
        item.status = "finish";
      } else if (startTime < finishTime && finishTime > endTime) {
        item.status = "finishOvertime";
      }
    } else {
      item.status = "wait";
    }
  });
  const startDate = listTime
    .map((item) => new Date(item.startTime).getTime())
    .sort((e, e2) => e - e2);
  const endDate = listTime
    .map((item) => new Date(item.endTime).getTime())
    .sort((e, e2) => e2 - e);
  // 如果当前开始月份===结束月份 则是当前月份
  const maxMinDate = {
    startDate: "",
    endDate: "",
  };
  if (props.ganttType === "day") {
    if (
      dayjs(startDate[0]).format("YYYY-MM") ===
      dayjs(endDate[0]).format("YYYY-MM")
    ) {
      // 取两天后的月份
      const nextTwoEndDateMonth = dayjs(endDate[0] + 86400000 * 2).format(
        "YYYY-MM"
      );
      // 取结束时间的月份
      const lastDateMonth = dayjs(endDate[0]).format("YYYY-MM");
      // 当前月份最后一天
      const nowMonthLastDayTime = dayjs(endDate[0] + 86400000 * 2)
        .endOf("month")
        .format("YYYY-MM-DD");
      maxMinDate.startDate = dayjs(startDate[0]).format("YYYY-MM") + "-01";
      // 如果加2天还等于当前月份 则取当前月份最后一天 否则获取下个月份2天后的值
      maxMinDate.endDate =
        nextTwoEndDateMonth === lastDateMonth
          ? nowMonthLastDayTime
          : dayjs(endDate[0] + 86400000 * 2).format("YYYY-MM-DD");
    } else {
      maxMinDate.startDate = dayjs(startDate[0] - 86400000).format(
        "YYYY-MM-DD"
      );
      maxMinDate.endDate = dayjs(endDate[0] + 86400000 * 2).format(
        "YYYY-MM-DD"
      );
    }
  } else if (props.ganttType === "month") {
    const now = dayjs(startDate[0]);
    const lastMonth = now.subtract(1, "month");

    if (
      dayjs(startDate[0]).format("YYYY") === dayjs(endDate[0]).format("YYYY")
    ) {
      // 取两个月后的年份
      const nextTwoEndDateMonth = dayjs(endDate[0] + 86400000 * 5).format(
        "YYYY-MM-DD"
      );
      // 取结束时间的年份
      const lastDateMonth = dayjs(endDate[0]).format("YYYY-MM-DD");
      // 当前年份最后一个月
      const nowMonthLastDayTime = dayjs(endDate[0] + 86400000 * 5)
        .endOf("month")
        .format("YYYY-MM-DD");
      maxMinDate.startDate =
        dayjs(startDate[0]).format("YYYY") +
        "-" +
        lastMonth.format("MM") +
        "-01";
      maxMinDate.endDate =
        nextTwoEndDateMonth === lastDateMonth
          ? nowMonthLastDayTime
          : dayjs(endDate[0]).format("YYYY-MM-DD");
    } else {
      maxMinDate.startDate =
        dayjs(startDate[0]).format("YYYY") +
        "-" +
        lastMonth.format("MM") +
        "-01";
      maxMinDate.endDate = dayjs(endDate[0] + 86400000 * 5).format(
        "YYYY-MM-DD"
      );
    }
  }
  if (
    isOvertime &&
    new Date(maxMinDate.endDate).getTime() < new Date().getTime()
  ) {
    maxMinDate.endDate = dayjs(new Date().getTime() + 86400000 * 3).format(
      "YYYY-MM-DD"
    );
  }

  resetSize(maxMinDate, listTime);
};

// 重新计算一下尺寸

onMounted(() => {
  initList();
  window.addEventListener("resize", debounce(initList, 200));
});

onUnmounted(() => {
  window.removeEventListener("resize", initList);
});

defineExpose({
  initList,
});
</script>

<style scoped></style>

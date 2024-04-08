<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
export type GanttDataStatusProps =
  | "finish"
  | "wait"
  | "progress"
  | "overtime"
  | "finishOvertime";

export type GanttType = "day" | "month";

export interface GanttStatusListProps {
  status: GanttDataStatusProps;
  text: string;
}

export interface BodyRectProps {
  height: number;
  scrollWidth: number;
  scrollHeight: number;
}
export interface GanttRefProps {
  initGantt: () => void;
  setGanttType: (type: GanttType) => void;
}
export interface GanttDataProps {
  finishTime: string | null;
  startTime: string;
  endTime: string;
  start: boolean;
  children?: GanttDataProps[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface GanttHeadProps {
  title: string;
  width?: string;
  key?: string;
  align?: "center" | "left" | "right";
}

export interface IListIF extends GanttDataProps {
  status?: GanttDataStatusProps;
  ganttId: string;
  left: number;
  width: number;
  progress: number;
  isParent: boolean;
  parentIsEmpty: boolean;
  isEmpty: boolean;
  overtimeWidth?: number;
}

export interface GanttProps {
  /**
   * 数据
   */
  data: GanttDataProps[];
  /**
   * 表头
   */
  head: GanttHeadProps[];
  /**
   * 表头
   */
  ganttType?: GanttType;

  /**
   * 高度
   */
  height?: string;
  /**
   * 表头宽度
   */
  headWidth?: string;
  /**
   * 显示竖线
   */
  showLine?: boolean;

  /**
   * 左侧表格body区域Y轴内边距
   */
  headBodyPaddingY?: number;
  /**
   * 左侧表格body区域X轴内边距
   */
  headBodyPaddingX?: number;
  /**
   * 是否显示左侧收起按钮
   */
  open?: boolean;
}

export interface YearListIF {
  year: string;
  length: number;
}
</script>

<style scoped></style>

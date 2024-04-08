<template>
  <div class="ganttOverview-box">
    <!-- 展开收起按钮  -->
    <div
      v-if="props.open"
      class="ganttOverview-arrrow-box"
      @click="handleOpenStatus"
    >
      <div class="ganttOverview-arrrow">
        <Arrow :isOpen="!props.openStatus" color="#696B6C" />
      </div>
    </div>
    <!-- 内容区域 -->
    <div
      :style="{ width: props.headWidth }"
      :class="props.openStatus ? 'ganttOverview' : 'ganttOverview-close'"
    >
      <div :style="{ width: props.headWidth }" class="ganttOverview-head-box">
        <div class="ganttOverview-head">
          <!-- 表头i -->
          <div
            v-for="(item, index) in props.head"
            :key="index"
            class="ganttOverview-head-item"
            :style="{
              textAlign: item.align ? item.align : 'center',
              width: item.width ? item.width : 'auto',
              maxWidth: item.width ? item.width : 'auto',
              minWidth: item.width ? item.width : 'auto',
            }"
          >
            {{ item.title }}
          </div>
        </div>
        <!-- 内容 -->
        <div class="ganttOverview-body">
          <div style="flex: 1; overflow: hidden">
            <div
              class="ganttOverview-body-height"
              :style="{
                paddingLeft: headBodyPaddingX + 'px',
                paddingRight: headBodyPaddingX + 'px',
                paddingTop: headBodyPaddingY + 'px',
                paddingBottom: headBodyPaddingY + 'px',
              }"
            >
              <div
                v-for="(item, index) in props.list"
                :key="index"
                class="ganttOverview-body-cell"
              >
                <div :key="index" class="ganttOverview-body-cell-filed">
                  <div
                    v-for="(i, n) in props.head"
                    :key="n"
                    :style="{
                      textAlign: i.align ? i.align : 'center',
                      width: i.width ? i.width : 'auto',
                      maxWidth: i.width ? i.width : 'auto',
                      minWidth: i.width ? i.width : 'auto',
                    }"
                    class="ganttOverview-body-cell-item"
                  >
                    {{ i.key ? item[i.key] : "" }}
                  </div>
                </div>
                <div v-if="item.children" class="ganttOverview-body-cell-open">
                  <div
                    v-for="(i, n) in item.children"
                    :key="n"
                    class="ganttOverview-body-cell-open-cell"
                  >
                    <div
                      v-for="(headItem, headIndex) in head"
                      :key="headIndex"
                      class="ganttOverview-body-cell-open-cell-item"
                      :class="
                        headIndex === 0
                          ? 'ganttOverview-body-cell-open-cell-item-first'
                          : ''
                      "
                    >
                      <div class="quan" v-if="headIndex === 0"></div>
                      <div
                        :style="{
                          width: headItem.width ? headItem.width : 'auto',
                          maxWidth: headItem.width ? headItem.width : 'auto',
                          minWidth: headItem.width ? headItem.width : 'auto',
                        }"
                      >
                        {{ headItem.key ? i[headItem.key] : "" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div :style="{ height: props.scrollBarHeight + 'px' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GanttHeadProps, GanttDataProps } from "./types.vue";
import { defineProps, onMounted } from "vue";
import Arrow from "./components/Arrow/index.vue";
import "./table.css";

interface TableProps {
  head: GanttHeadProps[];
  list: GanttDataProps[];
  headWidth: string;
  headBodyPaddingY: number;
  headBodyPaddingX: number;
  scrollBarHeight: number;
  open: boolean;
  openStatus: boolean;
}
const props = defineProps<TableProps>();
const emit = defineEmits(["onChange"]);
// 展开收起处理事件
const handleOpenStatus = () => {
  emit("onChange");
};

onMounted(() => {
  // props.openStatus.value = props.open;
});
</script>

<style scoped></style>

import type { App } from "vue";
import Gantt from "./index.vue";
import type {
  GanttDataProps,
  GanttHeadProps,
  GanttRefProps,
} from "./types.vue";

Gantt.install = (app: App) => {
  app.component(Gantt.__name as string, Gantt);
};

export default Gantt;

export type { GanttDataProps, GanttHeadProps, GanttRefProps };

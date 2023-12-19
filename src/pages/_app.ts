import type { App } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "@/services/queryClient";

export default (app: App) => {
	app.use(VueQueryPlugin, { queryClient });
};

<script lang="ts">
import type { InjectionKey } from "vue";
import {
	AccordionRoot,
	type AccordionRootProps,
	useEmitAsProps,
} from "radix-vue";

export const TREE_VIEW_ROOT_INJECTION_KEY = Symbol(
	"TreeViewContext",
) as InjectionKey<{
	values: Map<string, string | string[] | undefined>;
}>;
</script>

<script setup lang="ts">
import { provide, ref } from "vue";

defineProps<Omit<AccordionRootProps, "modelValue" | "defaultValue">>();
defineModel<Map<string, string | string[] | undefined>>();

const value = ref<string | string[]>();

provide(TREE_VIEW_ROOT_INJECTION_KEY, {
	values: new Map(),
});
</script>

<template>
	<AccordionRoot
		v-bind="{ ...$props, ...useEmitAsProps($emit) }"
		v-model="value"
	>
		<slot />
	</AccordionRoot>
</template>

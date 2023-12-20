<script setup lang="ts">
import { TREE_VIEW_ROOT_INJECTION_KEY } from "./TreeViewRoot.vue";
import { inject } from "vue";
import { AccordionRoot, type AccordionRootProps } from "radix-vue";

const props = defineProps<
	Omit<AccordionRootProps, "modelValue" | "defaultValue"> & { id: string }
>();

const context = inject(TREE_VIEW_ROOT_INJECTION_KEY);
if (!context) {
	throw new Error(
		`Injection \`${TREE_VIEW_ROOT_INJECTION_KEY.toString()}\` not found. Component must be used within \`TreeViewRoot\``,
	);
}
</script>

<template>
	<AccordionRoot
		v-bind="$props"
		:model-value="context.values.get(props.id)"
		@update:model-value="(v) => context.values.set(props.id, v)"
	>
		<slot />
	</AccordionRoot>
</template>

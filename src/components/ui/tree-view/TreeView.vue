<script setup lang="ts">
import {
	AccordionRoot,
	type AccordionRootProps,
	type AccordionRootEmits,
	useEmitAsProps,
} from "radix-vue";

defineProps<AccordionRootProps>();
defineEmits<AccordionRootEmits>();
</script>

<template>
	<AccordionRoot v-bind="{ ...$props, ...useEmitAsProps($emit) }">
		<slot />
	</AccordionRoot>
</template>

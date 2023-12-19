<script setup lang="ts">
import type { ComboboxRootEmits, ComboboxRootProps } from "radix-vue";
import { ComboboxRoot, useEmitAsProps } from "radix-vue";
import { cn, type ClassValue } from "@/utils";

defineProps<
	ComboboxRootProps & {
		class?: ClassValue;
	}
>();
defineEmits<ComboboxRootEmits>();
</script>

<template>
	<ComboboxRoot
		v-bind="{
			...$props,
			...useEmitAsProps($emit),
			modelValue: '',
			open: true,
			class: cn(
				'bg-stone-800 flex h-full w-full flex-col overflow-hidden rounded-md',
				$props.class,
			),
		}"
	>
		<slot />
	</ComboboxRoot>
</template>

<script setup lang="ts">
import type { ComboboxItemEmits, ComboboxItemProps } from "radix-vue";
import { ComboboxItem, useEmitAsProps } from "radix-vue";
import { cn, type ClassValue } from "@/utils";

defineProps<ComboboxItemProps & { class?: ClassValue }>();
defineEmits<ComboboxItemEmits>();
</script>

<template>
	<ComboboxItem
		v-bind="{
			...$props,
			...useEmitAsProps($emit),
			class: cn(
				'relative flex cursor-default select-none items-center text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 rounded-md bg-white/[.05] px-3 py-2 transition-colors data-[highlighted]:bg-white/10',
				$props.class,
			),
		}"
		@select.prevent
	>
		<slot />
	</ComboboxItem>
</template>

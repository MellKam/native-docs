<script setup lang="ts">
import type { ComboboxGroupProps } from "radix-vue";
import { ComboboxGroup, ComboboxLabel } from "radix-vue";
import { type ClassValue, cn } from "@/utils";

defineProps<
	ComboboxGroupProps & {
		heading?: string;
		class?: ClassValue;
	}
>();
</script>

<template>
	<ComboboxGroup
		v-bind="{
			...$props,
			class: cn('text-foreground overflow-hidden p-1', $props.class),
		}"
	>
		<ComboboxLabel
			v-if="heading"
			class="py-1.5 text-[13px] font-medium text-stone-200"
		>
			{{ heading }}
		</ComboboxLabel>
		<slot />
	</ComboboxGroup>
</template>

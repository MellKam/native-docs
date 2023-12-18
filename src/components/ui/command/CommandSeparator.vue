<script setup lang="ts">
import type { ComboboxSeparatorProps } from "radix-vue";
import { ComboboxSeparator } from "radix-vue";
import { cn, type ClassValue } from "@/utils";

defineProps<ComboboxSeparatorProps & { class?: ClassValue }>();
</script>

<template>
	<ComboboxSeparator
		v-bind="{
			...$props,
			class: cn('bg-border -mx-1 h-px', $props.class),
		}"
	>
		<slot />
	</ComboboxSeparator>
</template>

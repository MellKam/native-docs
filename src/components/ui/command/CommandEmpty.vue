<script setup lang="ts">
import type { ComboboxEmptyProps } from "radix-vue";
import { ComboboxEmpty } from "radix-vue";
import { cn, type ClassValue } from "@/utils";

defineProps<ComboboxEmptyProps & { class?: ClassValue }>();
</script>

<template>
	<ComboboxEmpty
		v-bind="{
			...$props,
			class: cn('py-6 text-center text-sm', $props.class),
		}"
	>
		<slot />
	</ComboboxEmpty>
</template>

<script setup lang="ts">
import type { ComboboxContentEmits, ComboboxContentProps } from "radix-vue";
import { ComboboxContent, useForwardPropsEmits } from "radix-vue";
import { cn, type ClassValue } from "@/utils";

const props = defineProps<ComboboxContentProps & { class?: ClassValue }>();
const emits = defineEmits<ComboboxContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
	<ComboboxContent
		v-bind="{
			...forwarded,
			class: cn('', $props.class),
		}"
	>
		<div role="presentation">
			<slot />
		</div>
	</ComboboxContent>
</template>

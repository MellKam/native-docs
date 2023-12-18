<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from "radix-vue";
import CloseIcon from "@/icons/close.svg?component";
import { cn, type ClassValue } from "@/utils";

defineProps<DialogCloseProps & { class?: ClassValue }>();
</script>

<template>
	<DialogClose
		v-bind="{
			...$props,
			class: cn(
				'absolute right-4 top-4 rounded-sm opacity-75 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
				$props.class,
			),
		}"
	>
		<CloseIcon class="h-5 w-5 stroke-[1.5] text-stone-300" />
	</DialogClose>
</template>

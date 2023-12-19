<script setup lang="ts">
import { cn, type ClassValue } from "@/utils";
import {
	DialogContent,
	type DialogContentProps,
	type DialogContentEmits,
	useEmitAsProps,
	DialogPortal,
	DialogOverlay,
} from "radix-vue";

defineProps<{ class?: ClassValue } & DialogContentProps>();
defineEmits<DialogContentEmits>();
defineOptions({ inheritAttrs: false });
</script>

<template>
	<DialogPortal>
		<DialogOverlay
			class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<DialogContent
			v-bind="{
				...$props,
				...$attrs,
				...useEmitAsProps($emit),
				class: cn(
					'fixed left-[50%] top-[50%] z-20 flex max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-stone-500 bg-stone-900 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:slide-out-to-left-1/2 outline-none',
					$props.class,
				),
			}"
		>
			<slot />
		</DialogContent>
	</DialogPortal>
</template>

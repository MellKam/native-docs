<script setup lang="ts">
import SearchMdIcon from "@/icons/search-md.svg?component";
import {
	ComboboxInput,
	type ComboboxInputProps,
	ComboboxCancel,
} from "radix-vue";
import { cn, type ClassValue } from "@/utils";
import { ref } from "vue";
import BackspaceIcon from "@/icons/backspace.svg?component";

defineProps<ComboboxInputProps & { class?: ClassValue; modelValue?: string }>();

const isFocused = ref(false);
</script>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>

<template>
	<div
		class="flex items-center justify-between gap-x-2 rounded-md border border-stone-500 bg-stone-800 px-[14px] ring-0 ring-green-300/[.15] transition-[box-shadow,border] data-[focused=true]:border-green-200 data-[focused=true]:ring-4"
		:data-focused="isFocused"
		cmdk-input-wrapper
	>
		<div class="flex w-full items-center gap-2">
			<slot name="search-icon">
				<SearchMdIcon class="h-6 w-6 shrink-0 stroke-[1.5] text-white/50" />
			</slot>
			<ComboboxInput
				v-bind="{
					placeholder: 'Search',
					type: 'text',
					autocomplete: 'off',
					...$props,
					class: cn(
						'h-[54px] w-full border-none bg-transparent text-lg text-white outline-none placeholder:text-white/60',
						$props.class,
					),
				}"
				@focus="isFocused = true"
				@blur="isFocused = false"
			/>
		</div>
		<ComboboxCancel v-if="modelValue" type="button" class="group inline-flex">
			<BackspaceIcon
				aria-hidden="true"
				class="h-6 w-6 stroke-[1.5] text-white/50 transition-colors group-hover:text-white/70"
			/>
		</ComboboxCancel>
	</div>
</template>

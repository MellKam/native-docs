<script setup lang="ts">
import { searchNativesQueryOptions } from "@/services/search";
import { useQuery } from "@tanstack/vue-query";
import { ref, computed } from "vue";
import SearchMdIcon from "@/icons/search-md.svg?component";
import BackspaceIcon from "@/icons/backspace.svg?component";
import ClockRewindIcon from "@/icons/clock-rewind.svg?component";
import CubeIcon from "@/icons/cube.svg?component";

const query = ref("");

const { data: searchResults } = useQuery(
	computed(() => {
		console.log(query.value);
		return {
			...searchNativesQueryOptions({ query: query.value }),
			enabled: query.value !== "",
		};
	}),
);

const isFocused = ref(false);
</script>

<template>
	<div class="flex flex-col bg-stone-700 px-3 pb-6 pt-3">
		<div
			class="flex justify-between rounded-md border border-stone-500 bg-stone-900 px-4 py-1.5 ring-0 ring-green-400/[.15] transition-[box-shadow,border] data-[focused=true]:border-green-200 data-[focused=true]:ring-4"
			:data-focused="isFocused"
		>
			<div class="flex w-full items-center gap-2">
				<SearchMdIcon class="h-[22px] w-[22px] stroke-[1.5] text-white/50" />
				<input
					type="text"
					@focus="isFocused = true"
					@blur="isFocused = false"
					autocomplete="off"
					v-model="query"
					placeholder="Search"
					class="h-10 w-full border-none bg-transparent text-lg text-white outline-none placeholder:text-white/60"
				/>
			</div>
			<button @click="query = ''" v-if="query">
				<BackspaceIcon class="h-6 w-6 stroke-[1.5] text-white/50" />
			</button>
		</div>

		<div>
			<span class="text-[13px] font-medium leading-5 text-green-200"
				>Recent</span
			>
			<ol class="flex flex-col gap-1">
				<li v-for="native in searchResults">
					<a
						:href="`/${native.hash}`"
						class="block rounded-md bg-white/[.04] px-3 py-2 transition-colors hover:bg-white/[.08]"
					>
						<div class="inline-flex items-center gap-3">
							<CubeIcon class="h-6 w-6 stroke-[1.5] text-[#B180D7]" />
							<div class="inline-flex flex-col">
								<span class="text-sm font-medium text-white">{{
									native.altName
								}}</span>
								<span class="text-xs leading-5 tracking-wide text-white/75">{{
									native.namespace
								}}</span>
							</div>
						</div>
					</a>
				</li>
			</ol>
		</div>
	</div>
</template>

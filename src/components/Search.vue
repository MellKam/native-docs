<script setup lang="ts">
import { searchNativesQueryOptions } from "@/services/search";
import { useQuery, queryOptions } from "@tanstack/vue-query";
import { ref, computed } from "vue";
// import ClockRewindIcon from "@/icons/clock-rewind.svg?component";
import ArrowUpIcon from "@/icons/arrow-up.svg?component";
import EnterIcon from "@/icons/enter.svg?component";
import CubeIcon from "@/icons/cube.svg?component";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
	CommandGroup,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDebounceFn } from "@vueuse/core";
import type { Native } from "@public/natives.json";
import type { MatchInfo } from "minisearch";

const searchTerm = ref("");
const setSearchTermWithDebounce = useDebounceFn((value: string) => {
	searchTerm.value = value;
}, 250);

const { data: searchResults } = useQuery(
	computed(() => {
		return queryOptions({
			...searchNativesQueryOptions({ query: searchTerm.value }),
			enabled: searchTerm.value !== "",
			placeholderData: (previousData) => previousData,
		});
	}),
);

const getMarkedFieldValue = (
	match: {
		native: Native & {
			namespace: string;
		};
		id: any;
		terms: string[];
		queryTerms: string[];
		score: number;
		match: MatchInfo;
	},
	fieldName: "name" | "altName",
) => {
	const fields = new Set(Object.values(match.match).flatMap((match) => match));
	if (!fields.has(fieldName)) {
		return match.native[fieldName];
	}
	return match.native[fieldName].replaceAll(
		new RegExp("(" + match.queryTerms.join("|") + ")", "ig"),
		"<mark>$1</mark>",
	);
};

const isOpen = ref(false);
</script>

<template>
	<button @click="isOpen = true">Open</button>
	<Dialog v-model:open="isOpen">
		<DialogContent class="overflow-hidden border-white/10 p-0">
			<Command
				@update:search-term="
					(value) => {
						if (value === '') {
							searchTerm = '';
						} else {
							setSearchTermWithDebounce(value);
						}
					}
				"
				:model-value="searchTerm"
				class="min-h-[340px] rounded-none px-3 pb-5 pt-3"
				:filter-function="(values) => values"
			>
				<CommandInput :model-value="searchTerm" />
				<CommandList v-if="searchTerm !== ''" class="mt-1.5">
					<CommandEmpty> Empty </CommandEmpty>
					<CommandGroup
						heading="Functions"
						class="flex flex-col p-0"
						v-if="searchResults?.length"
					>
						<CommandItem
							as="a"
							v-for="searchResult in searchResults"
							:href="`/${searchResult.id}`"
							:value="searchResult.id"
							:key="searchResult.id"
							class="mb-1 flex cursor-pointer items-center gap-3 last:mb-0"
						>
							<CubeIcon
								aria-hidden="true"
								class="h-6 w-6 shrink-0 select-none stroke-[1.5] text-[#B180D7]"
							/>
							<div class="flex flex-[0_0_auto] flex-col">
								<p
									class="truncate text-sm font-medium text-white [&>mark]:rounded-sm [&>mark]:bg-green-200/80"
									v-html="getMarkedFieldValue(searchResult, 'name')"
								></p>
								<span
									class="text-xs leading-5 tracking-wide text-white/75 [&>mark]:bg-transparent [&>mark]:text-white/75 [&>mark]:underline [&>mark]:underline-offset-2"
									v-html="getMarkedFieldValue(searchResult, 'altName')"
								></span>
							</div>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
			<div
				class="hidden gap-3 border-t border-white/10 bg-stone-900 p-3 sm:flex"
			>
				<div class="flex items-center">
					<div class="mr-1 rounded bg-white/10 px-1.5 py-[3px]">
						<ArrowUpIcon
							class="h-[14px] w-[14px] stroke-[1.5] text-stone-300"
						/>
					</div>
					<div class="mr-1.5 rounded bg-white/10 px-1.5 py-[3px]">
						<ArrowUpIcon
							class="h-[14px] w-[14px] rotate-180 stroke-[1.5] text-stone-300"
						/>
					</div>
					<span class="text-xs text-white/70">to navigate</span>
				</div>
				<div class="flex items-center">
					<div class="mr-1.5 rounded bg-white/10 px-1.5 py-[3px]">
						<EnterIcon class="h-[14px] w-[14px] stroke-[1.5] text-stone-300" />
					</div>
					<span class="text-xs text-white/70">to select</span>
				</div>
				<div class="flex items-center">
					<kbd
						class="mr-1.5 select-none rounded bg-white/10 px-1.5 py-[3px] text-xs text-white/60"
					>
						esc
					</kbd>
					<span class="text-xs text-white/70">to close</span>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>

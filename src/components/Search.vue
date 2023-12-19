<script setup lang="ts">
import {
	searchNativesQueryOptions,
	type SearchNativesResult,
} from "@/services/search";
import { useQuery, queryOptions } from "@tanstack/vue-query";
import { ref, computed, watch } from "vue";
import ClockRewindIcon from "@/icons/clock-rewind.svg?component";
import ArrowUpIcon from "@/icons/arrow-up.svg?component";
import SearchMdIcon from "@/icons/search-md.svg?component";
import EnterIcon from "@/icons/enter.svg?component";
import CubeIcon from "@/icons/cube.svg?component";
import SearchFileIcon from "@/icons/search-file.svg?component";
import { Spinner } from "@/components/ui/spinner";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
	CommandGroup,
} from "@/components/ui/command";
import {
	DialogRoot,
	DialogContent,
	DialogPortal,
	DialogOverlay,
} from "radix-vue";
import { useDebounceFn } from "@vueuse/core";
import {
	onKeyStroke,
	useLocalStorage,
	StorageSerializers,
	useMagicKeys,
} from "@vueuse/core";

const { Ctrl_K } = useMagicKeys({
	passive: false,
	onEventFired(e) {
		if (e.ctrlKey && e.key === "k" && e.type === "keydown") {
			e.preventDefault();
		}
	},
});

if (Ctrl_K) {
	watch(Ctrl_K, () => {
		isOpen.value = true;
	});
}

const searchTerm = ref("");
const setSearchTermWithDebounce = useDebounceFn((value: string) => {
	searchTerm.value = value;
}, 250);

const {
	data: searchResults,
	status,
	fetchStatus,
} = useQuery(
	computed(() => {
		return queryOptions({
			...searchNativesQueryOptions({ query: searchTerm.value }),
			enabled: searchTerm.value !== "",
			placeholderData: (previousData) => previousData,
		});
	}),
);

const getMarkedFieldValue = (
	match: SearchNativesResult,
	fieldName: "name" | "altName",
) => {
	const fields = new Set(Object.values(match.match).flat(1));
	if (!fields.has(fieldName)) {
		return match.native[fieldName];
	}
	return match.native[fieldName].replaceAll(
		new RegExp("(" + match.queryTerms.join("|") + ")", "ig"),
		"<mark>$1</mark>",
	);
};

const isOpen = ref(false);

onKeyStroke("Escape", () => {
	if (isOpen.value) {
		isOpen.value = false;
	}
});

type RecentSearch = { name: string; altName: string; hash: string };

const recentSearches = useLocalStorage<RecentSearch[]>("recent_searches", [], {
	serializer: StorageSerializers.object,
	shallow: true,
});

const prepentRecentSearchItem = (item: RecentSearch) => {
	// remove from list if already in it
	const newRecents = recentSearches.value.filter((r) => r.hash !== item.hash);
	newRecents.unshift(item);
	recentSearches.value = newRecents.slice(0, MAX_RECENT_SEARCH_ITEMS);
};

const cachedRecentSearches = ref(recentSearches.value);

watch(isOpen, () => {
	// update recent list only on the next open
	if (isOpen.value) {
		cachedRecentSearches.value = recentSearches.value;
	}
});

const MAX_RECENT_SEARCH_ITEMS = 5;
</script>

<template>
	<button
		class="flex h-10 w-full max-w-[280px] items-center justify-between rounded-md border border-white/10 bg-stone-900 px-3 transition-colors hover:border-white/25"
		@click="
			() => {
				searchTerm = '';
				isOpen = true;
			}
		"
	>
		<div class="inline-flex items-center gap-2">
			<SearchMdIcon class="h-5 w-5 stroke-[1.5] text-white/50" />
			<span class="text-white/60">Search</span>
		</div>
		<kbd
			class="rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white/60"
			>Ctrl K</kbd
		>
	</button>
	<DialogRoot v-model:open="isOpen">
		<DialogPortal>
			<DialogOverlay
				class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
			/>
			<DialogContent
				class="fixed left-0 right-0 top-0 z-20 mx-auto mt-[min(80px,7.5svh)] flex max-h-[85vh] min-h-[360px] w-[90vw] max-w-xl flex-col overflow-hidden rounded-xl border border-stone-500 bg-stone-900 shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
			>
				<Command
					@update:search-term="
						(value) => {
							if (!isOpen) return;
							if (value === '') {
								// set immediately, no need to wait
								searchTerm = '';
							} else {
								setSearchTermWithDebounce(value);
							}
						}
					"
					:search-term="searchTerm"
					class="flex-1 rounded-none bg-[linear-gradient(180deg,#1C1C1C_0%,#191919_100%)] px-3 pb-4 pt-3 sm:pb-6"
					:filter-function="(values) => values"
				>
					<CommandInput :model-value="searchTerm" />
					<CommandList class="mt-1.5">
						<div
							v-if="fetchStatus === 'fetching'"
							class="flex items-center justify-center gap-2 py-9"
						>
							<Spinner class="h-5 w-5" />
							<span class="text-sm text-white/75">Searching...</span>
						</div>
						<CommandGroup
							v-else-if="searchTerm === ''"
							heading="Recent"
							class="flex flex-col p-0"
						>
							<CommandItem
								as="a"
								v-for="recentSearch in cachedRecentSearches"
								:href="`/${recentSearch.hash}`"
								:value="recentSearch.hash"
								:key="recentSearch.hash"
								@select="() => prepentRecentSearchItem(recentSearch)"
								class="group relative mb-1 flex cursor-pointer items-center last:mb-0"
							>
								<ClockRewindIcon
									aria-hidden="true"
									class="h-6 w-6 shrink-0 select-none stroke-[1.5] text-stone-300"
								/>
								<div class="mx-3 flex flex-[1_1_auto] flex-col truncate">
									<span
										class="text-sm font-medium text-white [&>mark]:rounded-sm [&>mark]:bg-green-200/80"
										>{{ recentSearch.name }}</span
									>
									<span
										class="truncate text-xs leading-5 tracking-wide text-white/75 [&>mark]:bg-transparent [&>mark]:text-white/75 [&>mark]:underline [&>mark]:underline-offset-2"
										>{{ recentSearch.altName }}</span
									>
								</div>
								<EnterIcon
									class="mr-1 h-5 w-5 shrink-0 stroke-[1.5] text-white/60 opacity-0 transition-opacity group-data-[highlighted]:opacity-100"
								/>
							</CommandItem>
						</CommandGroup>
						<CommandEmpty
							v-else-if="status === 'success' && searchResults?.length === 0"
							class="flex flex-col items-center justify-center px-3 py-9 text-center"
						>
							<SearchFileIcon class="mb-2.5 h-11 w-11 text-stone-300" />
							<span class="mb-1 text-lg font-medium">
								No results for
								<span class="text-green-200">"{{ searchTerm }}"</span>
							</span>
							<span class="max-w-xs text-sm text-white/60">
								Try searching for something else and let's see if we can catch
								it next time!
							</span>
						</CommandEmpty>
						<CommandGroup
							heading="Functions"
							class="flex flex-col p-0"
							v-else-if="status === 'success'"
						>
							<CommandItem
								as="a"
								v-for="searchResult in searchResults"
								:href="`/${searchResult.id}`"
								:value="searchResult.id"
								:key="searchResult.id"
								@select="
									() =>
										prepentRecentSearchItem({
											name: searchResult.native.name,
											altName: searchResult.native.altName,
											hash: searchResult.id,
										})
								"
								class="group relative mb-1 flex cursor-pointer items-center last:mb-0"
							>
								<CubeIcon
									aria-hidden="true"
									class="h-6 w-6 shrink-0 select-none stroke-[1.5] text-[#B180D7]"
								/>
								<div class="mx-3 flex flex-[1_1_auto] flex-col truncate">
									<span
										class="text-sm font-medium text-white [&>mark]:rounded-sm [&>mark]:bg-green-200/80"
										v-html="getMarkedFieldValue(searchResult, 'name')"
									></span>
									<span
										class="truncate text-xs leading-5 tracking-wide text-white/75 [&>mark]:bg-transparent [&>mark]:text-white/75 [&>mark]:underline [&>mark]:underline-offset-2"
										v-html="getMarkedFieldValue(searchResult, 'altName')"
									></span>
								</div>
								<EnterIcon
									class="mr-1 h-5 w-5 shrink-0 stroke-[1.5] text-white/60 opacity-0 transition-opacity group-data-[highlighted]:opacity-100"
								/>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
				<div
					class="hidden gap-3 border-t border-stone-500 bg-stone-800 p-3 sm:flex"
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
							<EnterIcon
								class="h-[14px] w-[14px] stroke-[1.5] text-stone-300"
							/>
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
		</DialogPortal>
	</DialogRoot>
</template>

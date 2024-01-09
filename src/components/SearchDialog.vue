<script setup lang="ts">
import {
	searchNativesQueryOptions,
	type SearchNativesResult,
} from "@/services/search";
import { useQuery, queryOptions } from "@tanstack/vue-query";
import { ref, computed, watch } from "vue";
import ClockRewindIcon from "@/icons/clock-rewind.svg?component";
import LoaderIcon from "@/icons/loader.svg?component";
import ArrowUpIcon from "@/icons/arrow-up.svg?component";
import SearchMdIcon from "@/icons/search-md.svg?component";
import EnterIcon from "@/icons/enter.svg?component";
import CubeIcon from "@/icons/cube.svg?component";
import NotFoundIcon from "@/icons/not-found.svg?component";
import SearchFileIcon from "@/icons/search-file.svg?component";
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
	DialogTrigger,
} from "radix-vue";
import { useDebounceFn } from "@vueuse/core";
import { onKeyStroke, useLocalStorage, StorageSerializers } from "@vueuse/core";

const isOpen = ref(false);

onKeyStroke("Escape", (event: KeyboardEvent) => {
	if (event.type !== "keydown") return;
	if (isOpen.value) {
		isOpen.value = false;
	}
});

onKeyStroke(["k"], (event: KeyboardEvent) => {
	if (event.type !== "keydown") return;
	if (event.ctrlKey || event.metaKey) {
		event.preventDefault();
		isOpen.value = !isOpen.value;
	}
});

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

const getMarkedFieldValue = (match: SearchNativesResult, fieldName: "name") => {
	const fields = new Set(Object.values(match.match).flat(1));
	if (!fields.has(fieldName)) {
		return match.function[fieldName];
	}
	return match.function[fieldName].replaceAll(
		new RegExp("(" + match.queryTerms.join("|") + ")", "ig"),
		"<mark>$1</mark>",
	);
};

type RecentSearch = {
	name: string;
	hash: string;
	namespace: string;
};

const recentSearches = useLocalStorage<RecentSearch[]>("recent_searches", [], {
	serializer: StorageSerializers.object,
	shallow: true,
});

const MAX_RECENT_SEARCH_ITEMS = 5;

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
		searchTerm.value = "";
		cachedRecentSearches.value = recentSearches.value;
	}
});
</script>

<style>
html[data-os="mac"] .search-trigger-shortcut-content::after {
	content: "⌘ K";
}

.search-trigger-shortcut-content::after {
	content: "Ctrl K";
}
</style>

<template>
	<DialogRoot v-model:open="isOpen">
		<DialogTrigger
			class="search-trigger-shortcut-content flex h-10 w-full max-w-[280px] items-center justify-between rounded-md border border-white/10 bg-stone-900 px-3 outline-none ring-0 ring-white/[.08] transition-[box-shadow,border-color] after:block after:rounded after:bg-white/10 after:px-1.5 after:py-0.5 after:text-xs after:font-medium after:text-white/60 hover:border-white/25 focus-visible:border-white/25 focus-visible:ring-4"
			@click="searchTerm = ''"
		>
			<div class="inline-flex items-center gap-2">
				<SearchMdIcon class="h-5 w-5 stroke-[1.5] text-white/50" />
				<span class="text-[15px] text-white/60">Search</span>
			</div>
		</DialogTrigger>
		<DialogPortal>
			<DialogOverlay
				class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
			/>
			<DialogContent
				class="fixed left-0 right-0 top-0 z-20 mx-auto mt-[min(80px,7.5svh)] flex max-h-[85vh] min-h-[348px] w-[90vw] max-w-xl flex-col overflow-hidden rounded-xl border border-stone-500 bg-stone-900 shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
			>
				<Command
					@update:search-term="setSearchTermWithDebounce"
					:search-term="searchTerm"
					class="flex-1 rounded-none bg-[linear-gradient(180deg,#1C1C1C_0%,#191919_100%)] px-3 pb-4 pt-3 sm:pb-6"
					:filter-function="(values) => values"
				>
					<CommandInput :model-value="searchTerm">
						<template #search-icon>
							<LoaderIcon
								v-if="fetchStatus === 'fetching'"
								class="h-6 w-6 shrink-0 animate-spin stroke-[1.5] text-white/50"
							/>
							<SearchMdIcon
								v-else
								class="h-6 w-6 shrink-0 stroke-[1.5] text-white/50"
							/>
						</template>
					</CommandInput>
					<CommandList class="mt-1.5">
						<CommandGroup
							v-if="cachedRecentSearches.length && searchTerm === ''"
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
									>
										{{ recentSearch.name }}
									</span>
									<span
										class="inline-flex items-center truncate text-xs leading-5 tracking-wide text-white/75"
									>
										{{ recentSearch.namespace }}
									</span>
								</div>
								<EnterIcon
									class="mr-1 h-5 w-5 shrink-0 stroke-[1.5] text-white/60 opacity-0 transition-opacity group-data-[highlighted]:opacity-100"
								/>
							</CommandItem>
						</CommandGroup>
						<div
							v-else-if="cachedRecentSearches.length === 0 && searchTerm === ''"
							class="flex flex-col items-center px-3 py-10 text-center"
						>
							<SearchFileIcon class="mb-2.5 h-11 w-11 text-stone-300" />
							<span class="mb-1 text-lg font-medium"
								>Let's start exploring!</span
							>
							<span class="max-w-sm text-sm text-white/60">
								You can search for native functions by their names, description
								or even specific hash.
							</span>
						</div>
						<CommandEmpty
							v-else-if="status === 'success' && searchResults?.length === 0"
							class="flex flex-col items-center justify-center px-3 py-10 text-center"
						>
							<NotFoundIcon class="mb-3 h-11 w-11 stroke-[2] text-stone-300" />
							<span class="mb-1 text-lg font-medium">
								No results for
								<span class="text-green-200">"{{ searchTerm }}"</span>
							</span>
							<span class="max-w-sm text-sm text-white/60">
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
											name: searchResult.function.name,
											hash: searchResult.id,
											namespace: searchResult.function.namespace,
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
										class="inline-flex items-center truncate text-xs leading-5 tracking-wide text-white/75"
									>
										{{ searchResult.function.namespace }}
									</span>
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

<script setup lang="ts">
import {
	TreeViewItem,
	TreeViewContent,
	TreeViewHeader,
	TreeViewTrigger,
} from "@/components/ui/tree-view";
import ChevronUpIcon from "@/icons/chevron-up.svg?component";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";

const props = defineProps<{
	namespace: string;
}>();

const isEnabled = ref(false);

const queryClient = useQueryClient();

const { data: namespaceItems } = useQuery({
	queryKey: ["native-func", props.namespace],
	enabled: isEnabled,
	staleTime: Infinity,
	queryFn: async () => {
		const res = await fetch(`/api/natives/${props.namespace}.json`);
		if (!res.ok) {
			throw new Error(await res.text());
		}
		return res.json() as Promise<Record<string, string>>;
	},
});
</script>

<template>
	<TreeViewItem :value="namespace" class="relative">
		<TreeViewHeader
			class="group sticky top-0 z-10 rounded-md backdrop-blur transition-[box-shadow,background] hover:bg-stone-700 data-[state=open]:bg-stone-600/90"
		>
			<TreeViewTrigger
				class="flex w-full justify-between py-2 pl-2.5 pr-2"
				@click="isEnabled = true"
				@mouseenter="
					queryClient.prefetchQuery({
						queryKey: ['native-func', namespace],
						staleTime: Infinity,
					})
				"
			>
				<span class="text-sm font-medium">{{ namespace }}</span>
				<ChevronUpIcon
					class="h-5 w-5 rotate-90 stroke-[1.5] text-white/50 transition-transform group-data-[state=open]:rotate-180"
				/>
			</TreeViewTrigger>
		</TreeViewHeader>
		<TreeViewContent
			class="relative overflow-hidden py-1 pl-4 before:absolute before:left-2 before:top-0 before:block before:h-full before:w-px before:bg-white/10"
		>
			<a
				v-for="(altName, hash) in namespaceItems"
				:href="`/${hash}`"
				class="block w-full truncate rounded px-2 py-1 text-sm text-white/80 transition-colors hover:bg-stone-700 hover:text-white"
			>
				{{ altName }}
			</a>
		</TreeViewContent>
	</TreeViewItem>
</template>

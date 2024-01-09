<script setup lang="ts">
import { TreeViewRoot } from "@/components/ui/tree-view";
import AsideNavTreeNamespace from "./AsideNavTreeNamespace.vue";

defineProps<{
	namespaces: string[];
}>();
</script>

<template>
	<aside
		class="relative h-[calc(100dvh-var(--header-height))] w-[var(--aside-navigation-width)] overflow-y-auto border-r border-white/[.06] bg-stone-800 [--aside-navigation-width:300px]"
	>
		<nav class="flex flex-1 flex-col p-2.5">
			<TreeViewRoot type="single" class="flex flex-col" collapsible>
				<AsideNavTreeNamespace v-for="ns in namespaces" :namespace="ns" />
			</TreeViewRoot>
		</nav>
	</aside>
</template>

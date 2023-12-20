<script setup lang="ts">
import {
	TreeViewRoot,
	TreeViewSub,
	TreeViewContent,
	TreeViewHeader,
	TreeViewItem,
	TreeViewTrigger,
} from "@/components/ui/tree-view";
import ChevronUpIcon from "@/icons/chevron-up.svg?component";
</script>

<template>
	<TreeViewRoot type="multiple" class="flex flex-col">
		<TreeViewItem value="X">
			<TreeViewHeader
				class="group rounded-md transition-colors hover:bg-stone-700"
			>
				<TreeViewTrigger class="flex w-full justify-between py-2 pl-3 pr-2.5">
					<span class="text-sm font-medium">x</span>
					<ChevronUpIcon
						class="h-5 w-5 rotate-90 stroke-[1.5] text-white/50 transition-transform group-data-[state=open]:rotate-180"
					/>
				</TreeViewTrigger>
			</TreeViewHeader>
			<TreeViewContent
				class="relative flex flex-col overflow-hidden pl-3 ease-in before:absolute before:left-1.5 before:top-0 before:block before:h-full before:w-px before:bg-white/10 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			>
				<TreeViewSub
					v-for="item in ['x', 'y', 'z']"
					type="multiple"
					class="flex flex-col"
					:id="item"
				>
					<TreeViewItem :value="item">
						<TreeViewHeader
							class="group rounded-md transition-colors hover:bg-stone-700"
						>
							<TreeViewTrigger
								class="flex w-full justify-between py-2 pl-3 pr-2.5"
							>
								<span class="text-sm font-medium">{{ item }}</span>
								<ChevronUpIcon
									class="h-5 w-5 rotate-90 stroke-[1.5] text-white/50 transition-transform group-data-[state=open]:rotate-180"
								/>
							</TreeViewTrigger>
						</TreeViewHeader>
						<TreeViewContent
							class="relative flex flex-col overflow-hidden pl-3 ease-in before:absolute before:left-1.5 before:top-0 before:block before:h-full before:w-px before:bg-white/10 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
						>
							Data
						</TreeViewContent>
					</TreeViewItem>
				</TreeViewSub>
			</TreeViewContent>
		</TreeViewItem>
	</TreeViewRoot>
</template>

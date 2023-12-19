<script setup lang="ts">
import {
	AccordionRoot,
	AccordionItem,
	AccordionHeader,
	AccordionContent,
	AccordionTrigger,
} from "radix-vue";
import { ref } from "vue";
import ChevronUpIcon from "@/icons/chevron-up.svg?component";

const values = ref<string[]>([]);
const values2 = ref<string[]>([]);
</script>

<template>
	<AccordionRoot type="multiple" v-model="values" class="flex flex-col">
		<AccordionItem value="x">
			<AccordionHeader
				class="group rounded-md transition-colors hover:bg-stone-700"
			>
				<AccordionTrigger class="flex w-full justify-between py-2 pl-3 pr-2.5">
					<span class="text-sm font-medium">System</span>
					<ChevronUpIcon
						class="h-5 w-5 rotate-90 stroke-[1.5] text-white/50 transition-transform group-data-[state=open]:rotate-180"
					/>
				</AccordionTrigger>
			</AccordionHeader>
			<AccordionContent
				class="relative flex flex-col overflow-hidden pl-3 ease-in before:absolute before:left-1.5 before:top-0 before:block before:h-full before:w-px before:bg-white/10 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			>
				<AccordionRoot type="multiple" v-model="values2" class="flex flex-col">
					<AccordionItem value="y">
						<AccordionHeader
							class="group rounded-md transition-colors hover:bg-stone-700"
						>
							<AccordionTrigger
								class="flex w-full justify-between py-2 pl-3 pr-2.5"
							>
								<span class="text-sm font-medium">App</span>
								<ChevronUpIcon
									class="h-5 w-5 rotate-90 stroke-[1.5] text-white/50 transition-transform group-data-[state=open]:rotate-180"
								/>
							</AccordionTrigger>
						</AccordionHeader>
						<AccordionContent
							class="relative flex flex-col overflow-hidden pl-3 ease-in before:absolute before:left-1.5 before:top-0 before:block before:h-full before:w-px before:bg-white/10 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
						>
							Data
						</AccordionContent>
					</AccordionItem>
				</AccordionRoot>
			</AccordionContent>
		</AccordionItem>
	</AccordionRoot>
</template>

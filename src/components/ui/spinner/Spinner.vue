<script setup lang="ts">
withDefaults(
	defineProps<{
		barCount?: number;
		color?: string;
	}>(),
	{
		barCount: 12,
		color: "rgb(255 255 255 / 0.6)",
	},
);
</script>

<template>
	<div
		aria-busy="true"
		:style="{
			'--spinner-color': color,
			'--spinner-bar-count': barCount,
		}"
	>
		<div class="spinner">
			<div
				v-for="barIndex in barCount"
				class="spinner_bar"
				:style="{
					'--spinner-bar-index': barIndex,
				}"
			></div>
		</div>
	</div>
</template>

<style scoped>
.spinner {
	position: relative;
	top: 50%;
	left: 50%;
	width: inherit;
	height: inherit;
}

@keyframes spinner_spin {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0.1;
	}
}

.spinner_bar {
	position: absolute;
	left: -10%;
	top: -3.9%;
	width: 24%;
	height: 8%;
	border-radius: 5px;
	background: var(--spinner-color);

	transform: rotate(
			calc((360deg / var(--spinner-bar-count)) * var(--spinner-bar-index))
		)
		translate(146%);

	animation: spinner_spin linear infinite;
	animation-duration: calc((var(--spinner-bar-count) * 1s) / 10);
	animation-delay: calc(
		((var(--spinner-bar-count) + 1 - var(--spinner-bar-index)) * -1s) / 10
	);
}
</style>

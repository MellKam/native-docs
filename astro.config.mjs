import { defineConfig } from "astro/config";
import { fileURLToPath, URL } from "node:url";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import svg from "vite-svg-loader";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 3000,
	},
	integrations: [
		vue({
			appEntrypoint: "/src/pages/_app",
			script: {
				defineModel: true,
			},
		}),
		tailwind(),
	],
	output: "hybrid",
	adapter: node({
		mode: "standalone",
	}),
	vite: {
		plugins: [
			svg({
				svgo: false,
			}),
		],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
	},
});

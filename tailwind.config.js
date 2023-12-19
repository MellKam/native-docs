import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx,vue,astro,mdx}"],
	plugins: [animate],
	theme: {
		extend: {
			screens: {
				ss: "360px",
				xs: "480px",
			},
			container: {
				center: true,
				screens: {
					sm: "640px",
					md: "768px",
					lg: "1024px",
					xl: "1280px",
				},
			},
			fontFamily: {
				sans: [
					"Inter",
					"-apple-system",
					"BlinkMacSystemFont",
					"Roboto",
					"Helvetica",
					"sans-serif",
				],
			},
			colors: {
				white: "#FFFFFF",
				black: "#000000",
				stone: {
					50: "#EBEBEB",
					100: "#D6D6D6",
					200: "#ABABAB",
					300: "#828282",
					400: "#575757",
					500: "#2D2D2D",
					600: "#242424",
					700: "#1C1C1C",
					800: "#121212",
					900: "#0A0A0A",
					950: "#050505",
				},
				green: {
					50: "#DBFFEA",
					100: "#B3FFD1",
					200: "#6BFFA6",
					300: "#1FFF78",
					400: "#00D154",
					500: "#008736",
					600: "#006B2B",
					700: "#005221",
					800: "#003816",
					900: "#00190A",
					950: "#000F06",
				},
				red: {
					50: "#FBE9E9",
					100: "#F7D4D4",
					200: "#F1ACAC",
					300: "#E98181",
					400: "#E25A5A",
					500: "#DB2F2F",
					600: "#B72020",
					700: "#871717",
					800: "#5B1010",
					900: "#2B0808",
					950: "#160404",
				},
				orange: {
					50: "#FFF5E5",
					100: "#FFE9C7",
					200: "#FFD494",
					300: "#FFBE5C",
					400: "#FFA929",
					500: "#EF9000",
					600: "#C27400",
					700: "#8F5600",
					800: "#613A00",
					900: "#2E1C00",
					950: "#190F00",
				},
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"collapsible-down": {
					from: { height: "0" },
					to: { height: "var(--radix-collapsible-content-height)" },
				},
				"collapsible-up": {
					from: { height: "var(--radix-collapsible-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-in-out",
				"accordion-up": "accordion-up 0.2s ease-in-out",
				"collapsible-down": "collapsible-down 0.2s ease-in-out",
				"collapsible-up": "collapsible-up 0.2s ease-in-out",
			},
		},
	},
};

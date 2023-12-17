import { QueryClient } from "@tanstack/vue-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			retry: false,
		},
		queries: {
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	},
});

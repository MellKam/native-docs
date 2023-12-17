import type { Native } from "@public/natives.json";
import { queryOptions } from "@tanstack/vue-query";

export const searchNativesQueryOptions = (opts: {
	query: string;
	limit?: number;
}) =>
	queryOptions({
		queryKey: ["natives-search", opts.query, opts.limit || 5],
		queryFn: async () => {
			const url = new URL("/api/natives", "http://localhost:3000");
			url.searchParams.set("query", opts.query);
			url.searchParams.set("limit", (opts.limit || 5).toString());
			const res = await fetch(url);
			if (!res.ok) {
				throw new Error("Failed to fetch");
			}
			return res.json() as Promise<
				(Native & { hash: string; namespace: string })[]
			>;
		},
	});

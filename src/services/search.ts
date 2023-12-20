import type { NativeFunction } from "@public/functions.json";
import { queryOptions } from "@tanstack/vue-query";
import type { SearchResult } from "minisearch";

export type SearchNativesResult = SearchResult & {
	id: string;
	function: NativeFunction & {
		namespace: string;
	};
};

export const searchNativesQueryOptions = (opts: {
	query: string;
	limit?: number;
}) =>
	queryOptions({
		queryKey: ["natives-search", opts.query, opts.limit || 5],
		queryFn: async () => {
			const res = await fetch(
				`/api/search?query=${opts.query}&limit=${opts.limit || 5}`,
			);
			if (!res.ok) {
				throw new Error(`${res.statusText} ${res.status}: ${await res.text()}`);
			}
			return res.json() as Promise<SearchNativesResult[]>;
		},
	});

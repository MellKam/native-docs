import type { APIRoute } from "astro";
import natives from "@public/functions.json";
import MiniSearch from "minisearch";
import { hashToNativeFnMap } from "@/services/natives";
import { z } from "zod";

export const prerender = false;

const minisearch = new MiniSearch<{
	id: string;
	namespace: string;
	name: string;
	hashes: string[];
	oldNames: string[];
}>({
	fields: ["name", "hashes", "oldNames", "comment", "jhash"],
});

minisearch.addAll(
	Object.entries(natives).flatMap(([namespace, namespaceItems]) =>
		Object.entries(namespaceItems).map(([hash, native]) => {
			return {
				id: hash,
				jhash: native.jhash.length ? null : native.jhash,
				hashes: Object.values(native.hashes),
				namespace,
				name: native.name,
				comment: native.comment,
				oldNames: [...native.oldNames, ...(native.old_names || [])],
			};
		}),
	),
);

const searchParamsSchema = z.object({
	query: z.string().min(1),
	limit: z.coerce.number().default(5),
});

export const GET: APIRoute = (ctx) => {
	try {
		const searchParamsResult = searchParamsSchema.safeParse(
			Object.fromEntries(ctx.url.searchParams),
		);
		if (!searchParamsResult.success) {
			return new Response(JSON.stringify(searchParamsResult.error.issues), {
				headers: { "Content-Type": "application/json" },
				status: 400,
			});
		}
		const { limit, query } = searchParamsResult.data;

		const searchResults = query.trim().startsWith("0x")
			? // search by hashes only
				minisearch.search(query, {
					fields: ["id", "hashes", "jhash"],
					prefix: true,
					fuzzy: false,
					filter: (searchResult) => searchResult.score > 10,
				})
			: // search by all other fields
				minisearch.search(query, {
					fuzzy: true,
					prefix: true,
					fields: ["name", "oldName", "comment", "namespace"],
					boost: { comment: 0.4 },
					filter: (searchResult) => searchResult.score > 1,
				});

		const results = searchResults.slice(0, limit).map((result) => {
			return {
				...result,
				function: hashToNativeFnMap.get(result.id)!,
			};
		});

		return new Response(JSON.stringify(results), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(null, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
};

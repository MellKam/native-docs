import type { APIRoute } from "astro";
import natives, { type Native } from "@public/natives.json";
import MiniSearch from "minisearch";
import { z } from "zod";

export const prerender = false;

const hashToNativeMap = new Map<string, Native & { namespace: string }>(
	Object.entries(natives).flatMap(([namespace, namespaceItems]) => {
		return Object.entries(namespaceItems).map(([hash, native]) => [
			hash,
			{
				...native,
				namespace,
			},
		]);
	}),
);

const minisearch = new MiniSearch<{
	id: string;
	namespace: string;
	name: string;
	altName: string;
	hashes: string[];
	oldNames: string[];
}>({
	fields: ["name", "altName", "hashes", "oldNames", "comment", "jhash"],
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
				altName: native.altName,
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
		const result = searchParamsSchema.safeParse(
			Object.fromEntries(ctx.url.searchParams),
		);
		if (!result.success) {
			return new Response(JSON.stringify(result.error.issues), { status: 400 });
		}
		const { limit, query } = result.data;

		const searchResults = query.startsWith("0x")
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
					fields: ["name", "oldName", "altName", "comment"],
					boost: { comment: 0.4 },
					filter: (searchResult) => searchResult.score > 1,
				});

		const resultNatives = searchResults.slice(0, limit).map((result) => {
			return {
				...result,
				native: hashToNativeMap.get(result.id)!,
			};
		});

		return new Response(JSON.stringify(resultNatives));
	} catch (error) {
		return new Response(null, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
};

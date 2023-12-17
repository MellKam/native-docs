import type { APIRoute } from "astro";
import natives, { type Native } from "@public/natives.json";
import MiniSearch from "minisearch";
import { z } from "zod";

const hashToNativeMap = new Map<
	string,
	Native & { namespace: string; hash: string }
>(
	Object.entries(natives).flatMap(([namespace, namespaceItems]) => {
		return Object.entries(namespaceItems).map(([hash, native]) => [
			hash,
			{
				...native,
				hash,
				namespace,
			},
		]);
	})
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
				namespace,
				name: native.name,
				altName: native.altName,
				comment: native.comment,
				hashes: [native.jhash, ...Object.values(native.hashes)],
				oldNames: [...native.oldNames, ...(native.old_names || [])],
			};
		})
	)
);

const searchParamsSchema = z.object({
	query: z.string().min(1),
	limit: z.coerce.number().default(5),
});

export const GET: APIRoute = (ctx) => {
	try {
		const result = searchParamsSchema.safeParse(
			Object.fromEntries(ctx.url.searchParams)
		);
		if (!result.success) {
			return new Response(JSON.stringify(result.error.issues), { status: 400 });
		}
		const { limit, query } = result.data;

		const searchResults = minisearch.search(query, {
			fuzzy: 1,
			prefix: false,
			boost: { comment: 0.6, hashes: 2 },
		});
		const resultNatives = searchResults.slice(0, limit).map((result) => {
			return hashToNativeMap.get(result.id)!;
		});

		return new Response(JSON.stringify(resultNatives));
	} catch (error) {
		return new Response(null, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
};

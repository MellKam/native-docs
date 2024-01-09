import type { APIRoute, GetStaticPaths } from "astro";
import nativeFunctionsDB from "@public/functions.json";

export const getStaticPaths: GetStaticPaths = () => {
	return Object.keys(nativeFunctionsDB).map((namespace) => {
		return { params: { namespace } };
	});
};

export const GET: APIRoute = (ctx) => {
	const namespace = ctx.params.namespace!;
	if (!Object.keys(nativeFunctionsDB).includes(namespace)) {
		return new Response(JSON.stringify({ error: "Invalid namespace" }), {
			headers: { "Content-Type": "application/json" },
			status: 400,
		});
	}

	const result = Object.fromEntries(
		Object.entries(nativeFunctionsDB[namespace]!).map(([hash, native]) => [
			hash,
			native.altName,
		]),
	);

	return new Response(JSON.stringify(result), {
		headers: { "Content-Type": "application/json" },
	});
};

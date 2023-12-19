import natives, { type Native } from "@public/natives.json";

export const hashToNativeMap = new Map<
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

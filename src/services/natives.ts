import natives, { type NativeFunction } from "@public/functions.json";

export const hashToNativeFnMap = new Map<
	string,
	NativeFunction & { namespace: string }
>(
	Object.entries(natives).flatMap(([namespace, namespaceItems]) => {
		return Object.entries(namespaceItems).map(([hash, nativeFn]) => [
			hash,
			{
				...nativeFn,
				namespace,
			},
		]);
	}),
);

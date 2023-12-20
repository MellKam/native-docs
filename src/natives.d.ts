declare module "@public/functions.json" {
	export type NativeFunction = {
		name: string;
		jhash: string;
		comment: string;
		params: NativeFunctionParams[];
		build: number;
		results: string[];
		hashes: Record<number, string>;
		altName: string;
		oldNames: string[];
		old_names?: string[];
	};

	export type NativeFunctionParams = {
		type: string;
		name: string;
		ref?: boolean;
	};

	export type NativeFunctionsDB = Record<
		string, // namespace
		Record<string, NativeFunction> // hash -> function
	>;

	const db: NativeFunctionsDB;
	export default db;
}

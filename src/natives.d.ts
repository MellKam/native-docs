declare module "@public/natives.json" {
	export type Native = {
		name: string;
		jhash: string;
		comment: string;
		params: NativeParam[];
		build: number;
		results: string[];
		hashes: Record<number, string>;
		altName: string;
		oldNames: string[];
		old_names?: string[];
	};

	export type NativeParam = {
		type: string;
		name: string;
		ref?: boolean;
	};

	export type NativeDB = Record<string, Record<string, Native>>;

	const natives: NativeDB;
	export default natives;
}

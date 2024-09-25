/* eslint-disable no-restricted-imports */
import type fs from "node:fs/promises";
import type { InlangProject } from "./api.js";
import path from "node:path";
import { selectBundleNested } from "../query-utilities/selectBundleNested.js";
import { toMessageV1 } from "../json-schema/old-v1-message/toMessageV1.js";
import {
	absolutePathFromProject,
	withAbsolutePaths,
} from "./loadProjectFromDirectory.js";
import { detectJsonFormatting } from "../utilities/detectJsonFormatting.js";

export async function saveProjectToDirectory(args: {
	fs: typeof fs;
	project: InlangProject;
	path: string;
}): Promise<void> {
	if (args.path.endsWith(".inlang") === false) {
		throw new Error("The path must end with .inlang");
	}
	const files = await args.project.lix.db
		.selectFrom("file")
		.selectAll()
		.execute();

	// write all files to the directory
	for (const file of files) {
		if (file.path.endsWith("db.sqlite")) {
			continue;
		}
		const p = path.join(args.path, file.path);
		await args.fs.mkdir(path.dirname(p), { recursive: true });
		await args.fs.writeFile(p, new Uint8Array(file.data));
	}

	// run exporters
	const plugins = await args.project.plugins.get();
	const settings = await args.project.settings.get();
	const bundles = await selectBundleNested(args.project.db).execute();

	for (const plugin of plugins) {
		// old legacy remove with v3
		if (plugin.saveMessages) {
			await plugin.saveMessages({
				messages: bundles.map((b) => toMessageV1(b)),
				// @ts-expect-error - legacy
				nodeishFs: withAbsolutePaths(args.fs, args.path),
				settings,
			});
		}

		if (plugin.exportFiles) {
			const files = await plugin.exportFiles({
				bundles,
				settings,
			});
			for (const file of files) {
				const p = absolutePathFromProject(args.path, file.name);
				const dirname = path.dirname(p);
				if ((await args.fs.stat(dirname)).isDirectory() === false) {
					await args.fs.mkdir(dirname, { recursive: true });
				}
				if (p.endsWith(".json")) {
					try {
						const existing = await args.fs.readFile(p, "utf-8");
						const stringify = detectJsonFormatting(existing);
						await args.fs.writeFile(
							p,
							new TextEncoder().encode(
								stringify(JSON.parse(new TextDecoder().decode(file.content)))
							)
						);
					} catch {
						// write the file to disk (json doesn't exist yet)
						// yeah ugly duplication of write file but it works.
						await args.fs.writeFile(p, new Uint8Array(file.content));
					}
				} else {
					await args.fs.writeFile(p, new Uint8Array(file.content));
				}
			}
		}
	}
}
import type { NormalizedBase } from "./normaliseBase.js"
import { safeDecode } from "./safe-decode.js"

export type DataSuffix = `/${string}`
export type AbsolutePath = `/${string}`

/**
 * Takes a path and removes the base & data suffix
 *
 * @returns A tuple of the path and the data suffix
 */
export function parseRoute(
	fullPath: AbsolutePath,
	normalizedBase: NormalizedBase
): [AbsolutePath, DataSuffix | undefined] {
	const decodedPath = safeDecode(fullPath) as AbsolutePath

	const pathWithoutBase = removeBase(decodedPath, normalizedBase)
	const [path, dataSuffix] = removeDataSuffix(pathWithoutBase)
	return [path, dataSuffix]
}

/**
 * Adds the base & data suffix back to a path
 *
 * @param path The path to serialize
 * @param base The normalized base path
 * @param dataSuffix The data suffix (if it exists)
 */
export function serializeRoute(
	path: string,
	normalizedBase: NormalizedBase,
	dataSuffix: DataSuffix | undefined
): string {
	return normalizedBase + path + (dataSuffix ?? "")
}

/**
 * Removes the base from an absolute path
 * @param absolutePath
 * @param normalizedBase
 * @returns
 */
function removeBase(absolutePath: AbsolutePath, normalizedBase: NormalizedBase): AbsolutePath {
	const withoutBase = absolutePath.replace(normalizedBase, "")
	return withoutBase.startsWith("/") ? (withoutBase as AbsolutePath) : `/${withoutBase}`
}

/**
 * Removes any known data suffix from the path
 *
 * @param absolutePath The absolute path
 * @returns A tuple of the path and the data suffix
 */
function removeDataSuffix(absolutePath: AbsolutePath): [AbsolutePath, DataSuffix | undefined] {
	/** The path suffix SvelteKit adds on Data requests */
	const KNOWN_SUFFIXES: DataSuffix[] = ["/.html__data.json", "/__data.json"]

	const dataSuffix = KNOWN_SUFFIXES.find((suffix) => absolutePath.endsWith(suffix))

	if (dataSuffix) {
		return [(absolutePath.slice(0, -dataSuffix.length) || "/") as AbsolutePath, dataSuffix]
	} else {
		return [absolutePath, undefined]
	}
}

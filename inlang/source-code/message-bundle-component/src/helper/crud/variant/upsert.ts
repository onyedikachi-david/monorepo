import type { Message, Variant } from "@inlang/sdk/v2"
import { getNewVariantPosition } from "./sort.js"

/**
 * Upsert a variant into a message. If a variant with the same match already exists, it will be updated, otherwise a new variant will be added.
 * The function mutates message.
 * @param props.message The message to upsert the variant into.
 * @param props.variant The variant to upsert.
 */

const upsertVariant = (props: { message: Message; variant: Variant }) => {
	const uniqueMatch = props.variant.match
	const existingVariant = props.message.variants.find(
		(variant) => JSON.stringify(variant.match) === JSON.stringify(uniqueMatch)
	)

	if (existingVariant) {
		// Update existing variant
		existingVariant.pattern = props.variant.pattern
	} else {
		// Add new variant
		const newpos = getNewVariantPosition({
			variants: props.message.variants,
			newVariant: props.variant,
		})
		insertItemAtIndex(props.message.variants, newpos, props.variant)
	}
}

export default upsertVariant

function insertItemAtIndex(variants: Variant[], index: number, newVariant: Variant) {
	if (variants.length === 0) {
		variants.push(newVariant)
	} else {
		variants.splice(index, 0, newVariant)
	}
}

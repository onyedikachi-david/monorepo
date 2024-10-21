import {
	getLowestCommonAncestor,
	getLeafChange,
	type LixPlugin,
	type Conflict,
	getLeafChangesOnlyInSource,
} from "@lix-js/sdk";

export const detectConflicts: NonNullable<
	LixPlugin["detectConflicts"]
> = async ({ sourceLix, targetLix }) => {
	const result: Conflict[] = [];

	const leafChangesOnlyInSource = await getLeafChangesOnlyInSource({
		sourceLix,
		targetLix,
	});

	for (const change of leafChangesOnlyInSource) {
		const lowestCommonAncestor = await getLowestCommonAncestor({
			sourceChange: change,
			sourceLix,
			targetLix,
		});

		if (lowestCommonAncestor === undefined) {
			// no common parent, no conflict. must be an insert
			continue;
		}

		const leafChangeInTarget = await getLeafChange({
			change: lowestCommonAncestor,
			lix: targetLix,
		});

		if (lowestCommonAncestor.id === leafChangeInTarget.id) {
			// no conflict. the lowest common ancestor is
			// the leaf change in the target. aka, no changes
			// in target have been made that could conflict with the source
			continue;
		}

		const targetSnapshot = await targetLix.db
			.selectFrom("snapshot")
			.selectAll()
			.where("id", "=", leafChangeInTarget.snapshot_id)
			.executeTakeFirstOrThrow();

		const hasDiff =
			JSON.stringify(change.content) !== JSON.stringify(targetSnapshot.content);

		if (hasDiff === false) {
			continue;
		}

		// naive raise any snapshot difference as a conflict for now
		// more sophisticated conflict reporting can be incrementally added
		result.push({
			change_id: leafChangeInTarget.id,
			conflicting_change_id: change.id,
			reason:
				"The snapshots of the change do not match. More sophisticated reasoning will be added later.",
			metadata: null,
			resolved_change_id: null,
		});
	}

	return result;
};
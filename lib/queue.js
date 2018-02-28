/**
 * Stores context and update GitHub status to pending.
 *
 * @param {Context} ctx Modified Probot Context
 */
const queue = async (ctx, store) => {
	// Save context to store
	await store.save(ctx)

	// Report pending status to GitHub
	return ctx.github.repos.createStatus({
		sha: ctx.sha,
		context: 'commitlint',
		state: 'pending',
		description: 'waiting for the rules to be uploaded',
		...ctx.repo()
	})
}

module.exports = { queue }

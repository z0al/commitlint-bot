// Packages
const commitlint = require('@commitlint/lint')
const format = require('./format')

/**
 * Lints pull request commits list and report status
 *
 * @param {Context} ctx Modified Probot context that includes commitlint rules
 */
const lint = async ctx => {
	// owner/repo
	const repo = ctx.repo()

	// Pull request info
	const pull = ctx.issue()
	const { sha } = ctx.payload.pull_request.head

	// Rules
	const { rules } = ctx.payload.config

	// GH API
	const { github } = ctx

	// Paginate all PR commits
	return github.paginate(
		github.pullRequests.getCommits(pull),
		async ({ data }) => {
			// empty summary
			const report = { valid: true, commits: [] }
			// Keep counters
			let errorsCount = 0
			let warnsCount = 0

			// Iterates over all commits
			for (const d of data) {
				const { valid, errors, warnings } = await commitlint(
					d.commit.message,
					rules
				)

				if (!valid) {
					report.valid = false
				}

				if (errors.length > 0 || warnings.length > 0) {
					// Update counts
					errorsCount += errors.length
					warnsCount += warnings.length
					report.commits.push({ sha: d.sha, errors, warnings })
				}
			}

			// Final status
			await github.repos.createStatus({
				context: 'commitlint',
				sha,
				state: report.valid ? 'success' : 'failure',
				description: `found ${errorsCount} problems, ${warnsCount} warnings`,
				...repo
			})

			// Write a comment with the details (if any)
			if (errorsCount > 0 || warnsCount > 0) {
				const message = format(report.commits)
				await github.issues.createComment({ ...pull, body: message })
			}
		}
	)
}

module.exports = { lint }

// Packages
const { lint, load } = require('@commitlint/core')

// Ours
const config = require('./config')
const format = require('./format')

/**
 * Runs commitlint against all commits of the pull request and sets an appropriate
 * status check
 */
async function commitlint(context) {
	const { github } = context
	const pull = context.issue()
	const { sha } = context.payload.pull_request.head
	const repo = context.repo()

	// Hold this PR info
	const statusInfo = { ...repo, sha, context: 'commitlint' }

	// Pending
	await github.repos.createStatus({
		...statusInfo,
		state: 'pending',
		description: 'Waiting for the status to be reported'
	})

	// Paginate all PR commits
	github.paginate(github.pullRequests.getCommits(pull), async ({ data }) => {
		// empty summary
		const report = { valid: true, commits: {} }
		const { rules } = await load(config)

		// Iterates over all commits
		for (const d of data) {
			const { valid, errors, warnings } = await lint(d.commit.message, rules)
			if (!valid) {
				report.valid = false
			}

			if (errors.length > 0 || warnings.length > 0) {
				report.commits[d.sha] = { errors, warnings }
			}
		}

		const { summary, message } = format(report)

		// Final status
		await github.repos.createStatus({
			...statusInfo,
			state: report.valid ? 'success' : 'failure',
			description: summary
		})

		// Write a comment with the details (if any)
		if (message !== '') {
			await github.issues.createComment({ ...pull, body: message })
		}
	})
}

module.exports = commitlint

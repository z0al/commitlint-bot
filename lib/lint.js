// Packages
const { lint, load } = require('@commitlint/core')

// Ours
const config = require('./config')
const format = require('./format')

/**
 * Runs commitlint over all commits of the pull request and sets an appropriate
 * status check
 */
const commitlint = async ({ github, payload }) => {
	const { name, owner } = payload.repository
	const { number } = payload.pull_request

	// Hold this PR info
	const statusInfo = {
		sha: payload.pull_request.head.sha,
		repo: name,
		owner: owner.login,
		context: 'commitlint-bot',
		target_url: 'http://npm.im/@commitlint/config-angular#problems'
	}

	// Pending
	github.repos.createStatus({
		...statusInfo,
		state: 'pending',
		description: 'Waiting for the status to be reported'
	})

	// Paginate all PR commits
	github.paginate(
		github.pullRequests.getCommits({ repo: name, owner: owner.login, number }),
		async commits => {
			// empty summary
			const report = { valid: true, errors: [], warnings: [] }
			const { rules } = await load(config)

			// Iterate over all commits
			for (const d of commits.data) {
				const rep = await lint(d.commit.message, rules)
				if (!rep.valid) {
					report.valid = false
				}
				report.errors = report.errors.concat(rep.errors)
				report.warnings = report.errors.concat(rep.warnings)
			}

			// Final report
			github.repos.createStatus({
				...statusInfo,
				state: report.valid ? 'success' : 'error',
				description: format(report)
			})
		}
	)
}

module.exports = commitlint

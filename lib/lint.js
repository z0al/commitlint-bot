// Packages
const { lint, load } = require('@commitlint/core')

// Ours
const config = require('./config')
const format = require('./format')

// Globals
const baseStatus = {
	context: 'commitlint-bot',
	// commitlint rules reference URL
	target_url: 'http://npm.im/@commitlint/config-angular#problems'
}
const pendingStatus = {
	...baseStatus,
	state: 'pending',
	description: 'Running commitlint for this PR'
}

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
		owner: owner.login
	}

	// Pending
	github.repos.createStatus({ ...statusInfo, ...pendingStatus })

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
				...baseStatus,
				state: report.valid ? 'success' : 'error',
				description: format(report)
			})
		}
	)
}

module.exports = commitlint

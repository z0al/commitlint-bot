// Native
const { promisify } = require('util')

// Packages
const redis = require('redis')

const createStore = async () => {
	const client = redis.createClient(process.env.DB_URL)
	const get = promisify(client.get).bind(client)
	const set = promisify(client.set).bind(client)
	client.hse

	return {
		/**
		 * Restores Context from Redis store.
		 *
		 * @param {String} sha Commit SHA
		 * @async
		 */
		async restore(sha) {
			const raw = await get(sha)
			if (!raw) return null

			const { owner, repo, number, id } = JSON.parse(raw)

			return {
				pull_request: {
					number,
					head: { sha }
				},
				repository: {
					name: repo,
					owner: { login: owner }
				},
				installation: { id }
			}
		},
		/**
		 * Saves necessary context attributes to Redis.
		 *
		 * @param {Context} ctx Probot context
		 * @async
		 */
		async save(ctx) {
			// Neccessary for GitHub API authentication
			const { id } = ctx.payload.installation
			const issue = ctx.issue({ id })

			const { sha } = ctx.payload.pull_request.head

			// We use commit SHA as key. Keys will expire after 6 hours.
			return set(sha, JSON.stringify(issue), 'EX', 6 * 3600)
		}
	}
}

module.exports = { createStore }

// Packages
const { json } = require('body-parser')
const { upload } = require('./lib/upload')
const { createStore } = require('./lib/store')
const { queue } = require('./lib/queue')
const { lint } = require('./lib/lint')

/**
 * App staring point.
 *
 * For more information on building apps:
 * https://probot.github.io/docs/
 *
 * @param {Robot} robot
 */
const App = async robot => {
	// Redis-backed In-memory store for queued events
	const store = await createStore()

	// A helper to pass `store` as second param to handler
	const wrapStore = handler => async ctx => handler(ctx, store)

	// Queue webhooks
	// --------------
	robot.on('pull_request.opened', wrapStore(queue))
	robot.on('pull_request.synchronize', wrapStore(queue))

	// Process (Dequeue) events
	robot.on('commitlint.process', lint)

	// Upload API
	// ----------
	robot.route('/api').post('/upload', json(), async (req, res) => {
		return upload(req, res, robot, store)
	})
}

module.exports = App

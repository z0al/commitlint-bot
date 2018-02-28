jest.mock('../lib/store', () => ({
	createStore: jest.fn().mockReturnValue({})
}))

// Packages
const { createRobot } = require('probot')

// Ours
const app = require('../index')

const repo = { owner: 'user', repo: 'test' }

let robot, github, context

beforeEach(() => {
	// Here we create a robot instance
	robot = createRobot()
	// Here we initialize the app on the robot instance
	app(robot)
	// Mock GitHub client
	github = {
		issues: { createComment: jest.fn() },
		repos: { createStatus: jest.fn() },
		pullRequests: {
			getCommits: jest
				.fn()
				.mockReturnValueOnce({
					data: [{ sha: 'sha1', commit: { message: 'foo: message' } }]
				})
				.mockReturnValue({
					data: [{ sha: 'sha2', commit: { message: 'bar: message' } }]
				})
		},
		paginate: (fn, cb) => cb(fn)
	}
	// Passes the mocked out GitHub API into out robot instance
	robot.auth = () => Promise.resolve(github)

	context = {
		event: 'commitlint',
		payload: {
			action: 'process',
			pull_request: {
				number: 1,
				head: { sha: 'commit-sha' }
			},
			repository: {
				name: 'test',
				owner: { login: 'user' }
			},
			installation: { id: 111 },
			config: {
				rules: {}
			}
		}
	}
})

test('fetching the list of commits', async () => {
	await robot.receive(context)
	expect(github.pullRequests.getCommits).toBeCalledWith(
		expect.objectContaining({ ...repo, number: 1 })
	)
})

test('comment with errors/warnings', async () => {
	context.payload.config.rules = { 'type-enum': [1, 'always', ['foo']] }

	// Good message
	await robot.receive(context)
	expect(github.issues.createComment).not.toHaveBeenCalled()

	// Bad message
	await robot.receive(context)
	expect(github.issues.createComment).toBeCalled()
})

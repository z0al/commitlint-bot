// Packages
const expect = require('expect')
const { createRobot } = require('probot')

// Ours
const app = require('../index')
const githubMock = require('./mocks/github')
const events = require('./events')

// Constants
const baseStatus = {
	sha: '123456789',
	repo: 'test-commitlint-bot',
	owner: 'ahmed-taj',
	context: 'commitlint-bot',
	target_url: 'http://npm.im/@commitlint/config-angular#problems'
}

describe('commitlint-bot', () => {
	let robot
	let github

	beforeEach(() => {
		// Here we create a robot instance
		robot = createRobot()
		// Here we initialize the app on the robot instance
		app(robot)
		// Mock GitHub client
		github = githubMock()
		// Passes the mocked out GitHub API into out robot instance
		robot.auth = () => Promise.resolve(github)
	})

	describe('update status to pending', () => {
		it('calls createStatus with "pending"', async () => {
			const pending = {
				...baseStatus,
				state: 'pending',
				description: 'Waiting for the status to be reported'
			}
			// Simulates delivery of a payload
			// New PR
			await robot.receive(events.opened)
			expect(github.repos.createStatus).toHaveBeenCalledWith(pending)
			// Updated PR
			await robot.receive(events.synchronize)
			expect(github.repos.createStatus).toHaveBeenCalledWith(pending)
		})
	})
})

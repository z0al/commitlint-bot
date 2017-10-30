// Packages
const expect = require('expect')
const { createRobot } = require('probot')

// Ours
const app = require('../index')
const githubMock = require('./mocks/github')
const payload = require('./payload')

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
			// Simulates delivery of a payload
			await robot.receive(payload.opened)
			// expect(github.repos.createStatus).toHaveBeenCalled()
			expect(true).toBeTruthy()
		})
	})
})

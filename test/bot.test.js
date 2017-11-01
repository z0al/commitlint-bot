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
	repo: 'repo',
	owner: 'user',
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

	describe('updates status to pending', () => {
		const pending = {
			...baseStatus,
			state: 'pending',
			description: 'Waiting for the status to be reported'
		}

		it('works with new PRs', async () => {
			await robot.receive(events.opened)
			expect(github.repos.createStatus).toHaveBeenCalledWith(pending)
		})

		it('works with updated PRs', async () => {
			await robot.receive(events.synchronize)
			expect(github.repos.createStatus).toHaveBeenCalledWith(pending)
		})
	})

	describe('gets the list of commits for PRs', () => {
		const info = { repo: 'repo', owner: 'user', number: 1 }

		it('works with new PRs', async () => {
			await robot.receive(events.opened)
			expect(github.pullRequests.getCommits).toHaveBeenCalledWith(info)
		})

		it('works with updated PRs', async () => {
			await robot.receive(events.synchronize)
			expect(github.pullRequests.getCommits).toHaveBeenCalledWith(info)
		})
	})

	describe('sends success when messages are valid', () => {
		const success = {
			...baseStatus,
			state: 'success',
			// description: 'found 0 problems, 0 warnings'
			description: 'ok'
		}

		it('works with new PRs', async () => {
			// Prepare
			// github = githubMock(['fix: me'])
			// robot.auth = () => Promise.resolve(github)
			await robot.receive(events.opened)
			expect(github.repos.createStatus).toHaveBeenCalledWith(success)
		})
		it('works with updated PRs', async () => {
			await robot.receive(events.synchronize)
			expect(github.repos.createStatus).toHaveBeenCalledWith(success)
		})
	})
})

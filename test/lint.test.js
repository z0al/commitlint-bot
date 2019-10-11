// Packages
const { createRobot } = require('probot');

// Update necessary env vars
process.env.APP_NAME = 'commitlint-dev';

// Ours
const app = require('../index');
const events = require('./events');

const repo = { owner: 'user', repo: 'repo' };

let robot, github;

beforeEach(() => {
	// Here we create a robot instance
	robot = createRobot();
	// Here we initialize the app on the robot instance
	app(robot);
	// Mock GitHub client
	github = {
		issues: {
			createComment: jest.fn(),
			editComment: jest.fn(),
			deleteComment: jest.fn(),
			getComments: jest.fn().mockReturnValue({
				data: [
					{
						id: 1,
						user: {
							login: `${process.env.APP_NAME}[bot]`,
							id: 2,
							type: 'Bot'
						}
					}
				]
			})
		},
		repos: { createStatus: jest.fn() },
		pullRequests: {
			getCommits: jest
				.fn()
				.mockReturnValueOnce({
					data: [{ sha: 'abcd', commit: { message: 'test: message' } }]
				})
				.mockReturnValue({
					data: [{ sha: 'abcd', commit: { message: 'bad message' } }]
				})
		},
		paginate: (fn, cb) => cb(fn)
	};
	// Passes the mocked out GitHub API into out robot instance
	robot.auth = () => Promise.resolve(github);
});

test('status update to pending', async () => {
	await robot.receive(events.opened);
	expect(github.repos.createStatus).toHaveBeenCalledWith(
		expect.objectContaining({ state: 'pending' })
	);
});

test('fetching the list of commits', async () => {
	await robot.receive(events.opened);
	expect(github.pullRequests.getCommits).toHaveBeenCalledWith(
		expect.objectContaining({ ...repo, number: 1 })
	);
});

test('remove comment when no errors/warnings', async () => {
	await robot.receive(events.opened);
	expect(github.issues.createComment).not.toHaveBeenCalled();
	expect(github.issues.editComment).not.toHaveBeenCalled();
	expect(github.issues.getComments).toHaveBeenCalled();
	expect(github.issues.deleteComment).toHaveBeenCalled();

	await robot.receive(events.opened);
	expect(github.issues.editComment).toHaveBeenCalled();
	expect(github.issues.getComments).toHaveBeenCalled();
});

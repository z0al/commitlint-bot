// Packages
const { queue } = require('../lib/queue')

let ctx

beforeEach(() => {
	ctx = {
		sha: 'abcdefg',
		repo: () => ({}),
		// Redis
		store: {
			save: jest.fn()
		},
		github: { repos: { createStatus: jest.fn() } }
	}
})

test('stores context', async () => {
	await queue(ctx)
	expect(ctx.store.save).toBeCalledWith(ctx)
})

test('reports pending status to GitHub', async () => {
	await queue(ctx)
	expect(ctx.github.repos.createStatus).toBeCalledWith(
		expect.objectContaining({
			context: 'commitlint',
			state: 'pending',
			sha: ctx.sha
		})
	)
})

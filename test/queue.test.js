// Packages
const { queue } = require('../lib/queue')

let ctx, store

beforeEach(() => {
	// Redis
	store = {
		save: jest.fn()
	}

	ctx = {
		sha: 'abcdefg',
		repo: () => ({}),
		github: { repos: { createStatus: jest.fn() } }
	}
})

test('stores context', async () => {
	await queue(ctx, store)
	expect(store.save).toBeCalledWith(ctx)
})

test('reports pending status to GitHub', async () => {
	await queue(ctx, store)
	expect(ctx.github.repos.createStatus).toBeCalledWith(
		expect.objectContaining({
			context: 'commitlint',
			state: 'pending',
			sha: ctx.sha
		})
	)
})

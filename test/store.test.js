// Mock util.promisify
jest.mock('util', () => ({ promisify: fn => fn }))

// Mock 'redis' client
jest.mock('redis', () => ({
	createClient: jest.fn().mockReturnValue({
		get: jest.fn().mockReturnValue(
			JSON.stringify({
				number: 1,
				owner: 'user',
				repo: 'test',
				id: 111
			})
		),
		set: jest.fn()
	})
}))

// Packages
const redis = require('redis')
const { createStore } = require('../lib/store')

// Globals
const DB_URL = (process.env.DB_URL = 'redis://localhost')

const ctx = {
	issue: obj => ({ number: 1, owner: 'user', repo: 'test', ...obj }),
	payload: {
		pull_request: { number: 1, head: { sha: 'commitSHA' } },
		installation: { id: 111 }
	}
}

test('uses DB_URL as redis URL', async () => {
	await createStore()
	expect(redis.createClient).toBeCalledWith(DB_URL)
})

test('stores Context with expiration period', async () => {
	const client = await createStore()
	const expCtx = JSON.stringify(ctx.issue({ id: 111 }))

	await client.save(ctx)
	expect(redis.createClient().set).toBeCalledWith(
		'commitSHA',
		expCtx,
		'EX',
		expect.any(Number)
	)
})

test('restores Context as Object using commit SHA', async () => {
	const client = await createStore()
	await client.save(ctx)

	const { sha } = ctx.payload.pull_request.head
	const rec = await client.restore(sha)

	expect(sha).toEqual(rec.pull_request.head.sha)
	expect(ctx.payload.installation.id).toEqual(rec.installation.id)
})

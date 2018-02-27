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
				installation_id: 111
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
const installation_id = 111
const ctx = {
	installation_id,
	issue: obj => ({
		number: 1,
		owner: 'user',
		repo: 'test',
		installation_id
	}),
	payload: { pull_request: { head: { sha: 'commitSHA' } } }
}

test('uses DB_URL as redis URL', async () => {
	await createStore()
	expect(redis.createClient).toBeCalledWith(DB_URL)
})

test('stores Context with expiration period', async () => {
	const client = await createStore()
	const expCtx = JSON.stringify(ctx.issue({ installation_id }))

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

	const sha = ctx.payload.pull_request.head.sha
	const rec = await client.restore(sha)

	expect(sha).toEqual(rec.sha)
	expect(installation_id).toEqual(rec.installation_id)
	expect(ctx.issue()).toEqual(expect.objectContaining(rec.issue()))
	expect(ctx.issue()).toEqual(expect.objectContaining(rec.repo()))
})

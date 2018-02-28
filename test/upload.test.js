const { upload } = require('../lib/upload')

let req, res, robot, store, payload

beforeEach(() => {
	// Express Request
	req = {
		body: {
			number: 1,
			owner: 'user',
			repo: 'test',
			head: 'commit-sha',
			config: { rules: {} }
		}
	}

	// Express Response
	res = {
		status: jest.fn().mockReturnValue({ send: jest.fn() })
	}

	// Probot
	robot = { receive: jest.fn() }

	payload = {
		pull_request: {
			number: 1,
			head: { sha: 'commit-sha' }
		},
		repository: {
			name: 'test',
			owner: { login: 'user' }
		},
		installation: { id: 111 }
	}

	// Store object
	store = {
		restore: jest.fn().mockReturnValue(payload)
	}
})

test('returns 404 if no event found', async () => {
	const emptyStore = {
		restore: jest.fn().mockReturnValueOnce(null)
	}

	await upload(req, res, robot, emptyStore)
	expect(emptyStore.restore).toBeCalledWith('commit-sha')
	expect(res.status).toBeCalledWith(404)
})

test('validates JSON body', async () => {
	await upload({ body: {} }, res, robot, store)
	expect(store.restore).not.toBeCalled()
	expect(res.status).toBeCalledWith(400)
})

test('triggers `commitlitn.process` event with payload', async () => {
	await upload(req, res, robot, store)

	expect(robot.receive).toBeCalledWith(
		expect.objectContaining({
			event: 'commitlint',
			payload: {
				action: 'process',
				config: { rules: {} },
				...payload
			}
		})
	)
})

test('sends 200 at the end', async () => {
	await upload(req, res, robot, store)
	expect(res.status).toBeCalledWith(200)
})

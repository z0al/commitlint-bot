// Packages
const expect = require('expect')

// Mock necessary GitHub APIs here
module.exports = data => {
	const commits = data || [
		{ commit: { message: 'fix: issue #1' } },
		{ commit: { message: 'fix: issue #2' } },
		{ commit: { message: 'fix: issue #3' } },
		{ commit: { message: 'fix: issue #4' } }
	]
	return {
		repos: {
			createStatus: expect.createSpy()
		},
		pullRequests: {
			getCommits: expect.createSpy().andReturn(Promise.resolve({ commits }))
		},
		paginate: (fn, callback) => {
			callback(fn)
		}
	}
}

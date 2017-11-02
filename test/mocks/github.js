// Packages
const expect = require('expect')

// Mock necessary GitHub APIs here
module.exports = (data = []) => {
	return {
		issues: {
			createComment: expect.createSpy()
		},
		repos: {
			createStatus: expect.createSpy()
		},
		pullRequests: {
			getCommits: expect.createSpy().andReturn(
				Promise.resolve({
					data: data.map(e => {
						return { sha: 'abcd', commit: { message: e } }
					})
				})
			)
		},
		paginate: async (fn, callback) => {
			callback(await fn)
		}
	}
}

// Packages
const expect = require('expect')

// Mock necessary GitHub APIs here
module.exports = (data = ['fix: issue #1']) => {
	return {
		repos: {
			createStatus: expect.createSpy()
		},
		pullRequests: {
			getCommits: expect.createSpy().andReturn({
				data: data.map(e => {
					return { commit: { message: e } }
				})
			})
		},
		paginate: async (fn, callback) => {
			callback(await fn)
		}
	}
}

// Packages
const expect = require('expect')

// Mock necessary GitHub APIs here
module.exports = () => {
	return {
		repos: {
			createStatus: expect.createSpy()
		}
	}
}

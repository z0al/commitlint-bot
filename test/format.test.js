// Packages
const expect = require('expect')

// Ours
const format = require('../lib/format')

describe('lib/format', () => {
	const report1 = { commits: {} }
	const report2 = {
		commits: {
			'1': { errors: [], warnings: [{ message: 'warning message' }] }
		}
	}
	const report3 = {
		commits: {
			'2': {
				errors: [{ message: 'error message' }],
				warnings: [{ message: 'warning message' }]
			}
		}
	}

	it('generates summary', () => {
		// Report 1
		expect(format(report1).summary).toEqual('found 0 problems, 0 warnings')
		// Report 2
		expect(format(report2).summary).toEqual('found 0 problems, 1 warnings')
		// Report 3
		expect(format(report3).summary).toEqual('found 1 problems, 1 warnings')
	})

	it('generates comment body', () => {
		// Report 1
		expect(format(report1).message).toEqual('')
		// Report 2
		expect(format(report2).message).toMatch(/Commit: 1/)
		expect(format(report2).message).toMatch(/warning message/)
		// Report 3
		expect(format(report3).message).toMatch(/Commit: 2/)
		expect(format(report3).message).toMatch(/error message/)
		expect(format(report3).message).toMatch(/warning message/)
	})
})

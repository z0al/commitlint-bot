// Packages
const expect = require('expect')

// Ours
const format = require('../lib/format')

const values = [
	// #1
	{ commits: {} },
	// #2
	{
		commits: {
			'1': { errors: [], warnings: [{ message: 'warning message' }] }
		}
	},
	// #3
	{
		commits: {
			'2': {
				errors: [{ message: 'error message' }],
				warnings: [{ message: 'warning message' }]
			}
		}
	}
]

test('generates summary', () => {
	// #1
	expect(format(values[0]).summary).toEqual('found 0 problems, 0 warnings')
	// #2
	expect(format(values[1]).summary).toEqual('found 0 problems, 1 warnings')
	// #3
	expect(format(values[2]).summary).toEqual('found 1 problems, 1 warnings')
})

test('generates comment body', () => {
	// #1
	expect(format(values[0]).message).toEqual('')

	// #2
	expect(format(values[1]).message).toMatch(/Commit: 1/)
	expect(format(values[1]).message).toMatch(/warning message/)
	// #3
	expect(format(values[2]).message).toMatch(/Commit: 2/)
	expect(format(values[2]).message).toMatch(/error message/)
	expect(format(values[2]).message).toMatch(/warning message/)
})

// Ours
const format = require('../lib/format');

const commits = [
	// #1
	[
		{
			sha: 'abc',
			errors: [],
			warnings: [
				{
					message: 'warning message'
				}
			]
		}
	],

	// #2
	[
		{
			sha: 'def',
			errors: [
				{
					message: 'error message'
				}
			],
			warnings: [
				{
					message: 'warning message'
				}
			]
		}
	]
];

test('replaces placeholder', () => {
	expect(format(commits[0])).not.toMatch(/PLACEHOLDER/);
});

test('replaces details', () => {
	expect(format(commits[0])).not.toMatch(/DETAILS/);
});

test('generates comment body', () => {
	// #1
	expect(format(commits[0])).toMatch(/Commit: abc/);
	expect(format(commits[0])).toMatch(/warning message/);
	// #2
	expect(format(commits[1])).toMatch(/Commit: def/);
	expect(format(commits[1])).toMatch(/error message/);
	expect(format(commits[1])).toMatch(/warning message/);
	// test both
	expect(format(commits.flat())).toMatch(/\* abc\n\* def/);
});

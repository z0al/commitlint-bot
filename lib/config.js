/**
 * commitlint Conventional Commits rules 
 * 
 * https://conventionalcommits.org
 */
module.exports = {
	rules: {
		// A longer commit body MAY be provided after the short description. The
		// body MUST begin one blank line after the description.
		'body-leading-blank': [2, 'always'],
		// A description MUST immediately follow the type/scope prefix.
		'subject-empty': [2, 'never'],
		// commits MUST be prefixed with a type, which consists of a verb, feat,
		// fix, etc., followed by a colon and a space.
		'type-empty': [2, 'never']
	}
}

/**
 * Formats commitlint report as GitHub status report
 * 
 * @param {*} report 
 */
const format = report => {
	const { errors, warnings } = report

	// Summary
	let message = `found ${errors.length} problems, ${warnings.length} warnings\n`

	// Errors
	if (errors.length > 0) {
		message += '\n' + errors.map(e => '✖ ' + e.message).join('\n')
	}
	// Warnings
	if (warnings.length > 0) {
		message += '\n' + warnings.map(e => '⚠ ' + e.message).join('\n')
	}

	return message
}
module.exports = format

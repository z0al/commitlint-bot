/**
 * Formats commitlint report as GitHub status report
 * 
 * @param {Object} report 
 */
const format = report => {
	const { commits } = report

	// Keep errors/warnings count
	let errorsCount = 0
	let warnsCount = 0

	// Details message
	let message = ''

	for (const commit in commits) {
		message += `* Commit: ${commit}\n`
		const { errors, warnings } = commits[commit]
		for (const e of errors) {
			message += `  - ✖ ${e.message}\n`
		}
		for (const w of warnings) {
			message += `  - ⚠ ${w.message}\n`
		}
		errorsCount += errors.length
		warnsCount += warnings.length
	}

	// Summary
	const summary = `found ${errorsCount} problems, ${warnsCount} warnings`
	if (errorsCount > 0 || warnsCount > 0) {
		message = `There were the following issues with this Pull Request\n${message}`
	}
	return { summary, message }
}

module.exports = format

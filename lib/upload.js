// Packages
const Joi = require('joi')

// JSON body schema
const schema = Joi.object()
	.keys({
		owner: Joi.string()
			.required()
			.label('owner'),
		repo: Joi.string()
			.required()
			.label('repo'),
		number: Joi.number()
			.required()
			.label('number'),
		head: Joi.string()
			.required()
			.label('head'),
		config: Joi.object()
			.keys({
				rules: Joi.object()
					.required()
					.label('rules')
			})
			.unknown()
			.required()
			.label('config')
	})
	.unknown()

/**
 * Upload API for commitlint configurations
 *
 * @param {Request} req Express Request object
 * @param {Response} res Express Response object
 * @param {Probot} robot Probot instance
 * @param {Store} store Store instance
 */
const upload = async (req, res, robot, store) => {
	// JSON validation
	const result = Joi.validate(req.body, schema)
	if (result.error) return res.status(400).send(result.error.details)

	// Extract necessary info
	const { head, config } = req.body

	// Dequeue event (if any)
	const event = await store.restore(head)

	// Not found?
	if (!event) return res.status(404).send('Not found')

	// Trigger linting
	await robot.receive({
		event: 'commitlint',
		payload: { action: 'process', config, ...event }
	})

	// TODO: remove `event` from the store

	return res.status(200).send('OK')
}

module.exports = { upload }

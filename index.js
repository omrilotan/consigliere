exports.spawn = ({ log = console.log } = {}) => new Proxy(
	{},
	{
		get: (target, level) => (message, props = {}) => log(
			JSON.stringify({
				message,
				level,
				...props
			})
		)
	}
)

exports.logger = exports.spawn()

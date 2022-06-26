const dotenv  = require('dotenv')
const env     = process.env.NODE_ENV
const envmode = {
	'production': './.env-production',
	'development': './.env'
}

const fileConfig = (env in envmode) ? envmode[env] : envmode['development']

dotenv.config({ path: fileConfig })

const config = {
	env: env,
	timezone: 'Asia/Jakarta',
	port: process.env.APP_PORT,
    db: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD,
		name: process.env.DB_NAME
	},
	session: {
		name: process.env.SESS_NAME,
		secret: process.env.SESS_SECRET
	},
    dirLog: process.env.LOG_DIR
}

module.exports = config
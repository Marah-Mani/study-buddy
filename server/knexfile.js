module.exports = {
	development: {
		client: 'mysql',
		connection: {
			host: '127.0.0.1',
			user: 'root',
			password: '',
			database: 'stayable'
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './db/migrations'
		},
		seeds: {
			directory: './db/seeds'
		}
	}
};

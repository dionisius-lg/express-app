const mysql = require('mysql')
const config = require('./index')

const conn  = mysql.createConnection({
    host        : config.db.host,
    port        : config.db.port,
    user        : config.db.user,
    password    : config.db.pass,
    database    : config.db.name,
    dateStrings : true
})

conn.connect(function (err) {
    if (err) {
        console.error(`Error connecting to database ${err.stack}`)
        return
    }

    console.log(`Database connected as id ${conn.threadId}`)
})

module.exports = conn
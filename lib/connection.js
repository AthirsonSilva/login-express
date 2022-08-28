const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '127.0.0.1',
    dialect: 'mysql',
    user: 'root',
    password: '!Potter4',
    database: 'login'
})

connection.connect(error => {
    if(!!error) {
        console.log(error)
    } else {
        console.info('Connected to database')
    }
})

module.exports = connection;
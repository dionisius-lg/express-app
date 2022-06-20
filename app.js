const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const flash = require('express-flash')
const session = require('express-session')
const router = require('./src/routes')
const config = require('./src/configs')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(logger('dev'))
app.use(flash())
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'test123',
    name: 'secretname',
    cookie: {
        sameSite: true,
        // maxAge: 60000
    }
}))

app.use(router)

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    res.setHeader('Pragma', 'no-cache')
    next()
})

// error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(config.port, (err) => {
    if (err) {
        console.error(`App error`)
    } else {
        console.log(`App is up and running for ${config.env} environment | PORT: ${config.port}`)
    }
})

const connection = require('../lib/connection')
const express = require('express')
const router = express.Router()

// display login page
router.get('/', (req, res, next) => {
    res.render('auth/login', {
        title: 'Login',
        email: '',
        password: '',
    })
})

// display login page
router.get('/login', (req, res, next) => {
    res.render('auth/login', {
        title: 'Login',
        email: '',
        password: '',
    })
})

// authenticate user
router.get('/authentication', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, rows, fields) => {
        if(err) throw err 

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Please correct enter email and password')
            req.redirect('/login')
        } else { // if user found
            req.session.loggedin = true
            req.session.name = name
            res.redirect('/home')
        }
    })
})

// display registration page
router.get('/register', (req, res, next) => {
    res.render('auth/register', {
        title: 'Registration page',
        name: '',
        email: '',
        password: ''
    })
})

// user registration
router.post('/post-register', (req, res, next) => {
    res.assert('name', 'Name is required').notEmpty() // validate name
    res.assert('password', 'Password is required').notEmpty() // validate password
    res.assert('email', 'Email is required').notEmpty() // validate email

    let errors = req.validationErrors() // validate all fields

    if(!errors) { // no errors were found. Passed validation
        const user = { // create user object
            name: req.sanitize('name').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            password: req.sanitize('password').escape().trim()
        }

        connection.query('INSERT INTO users SET ?', user, (err, result) => {
            // if(err) throw err
            if (err) {
                req.flash('error', err)

                res.render('auth/register', {
                    title: 'Registration page',
                    name: '',
                    email: '',
                    password: ''
                })
            } else { // if no errors
                req.flash('success', 'You have been registered')
                res.redirect('/login')
            }
        })
    } else { // display errors to user
        let error_msg = ''
        errors.forEach((err) => {
            error_msg += error.msg + '<br>'
        })

        req.flash('error', error_msg)

        /* 
            using req.body.name
            because req.param('name') is deprecated
        */

        res.render('auth/register', {
            title: 'Registration page',
            name: req.body.name,
            email: req.body.email,
            password: ''
        })
    }
})

// display home page
router.get('/home', (req, res, next) => {
    if (req.session.loggedin) { // if user is logged in, render the admin page
        res.render('/auth/home', {
            title: 'Admin Dashboard',
            name: req.session.name
        })
    } else { // if user is not logged in, redirect to login page
        req.flash('success', 'Please login first')
        res.redirect('/login')
    }
})

// logout user
router.get('/logout', (req, res, next) => {
    req.session.destroy()
    req.flash('success', 'Login again here')
    res.redirect('/login')
})

module.exports = router

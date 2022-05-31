require('dotenv').config()
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { engine } = require('express-handlebars')

const app = express()
const PORT = process.env.PORT || 3000

const users = [
  {
    firstName: 'Tony',
    email: 'tony@stark.com',
    password: 'iamironman'
  },
  {
    firstName: 'Steve',
    email: 'captain@hotmail.com',
    password: 'icandothisallday'
  },
  {
    firstName: 'Peter',
    email: 'peter@parker.com',
    password: 'enajyram'
  },
  {
    firstName: 'Natasha',
    email: 'natasha@gamil.com',
    password: '*parol#@$!'
  },
  {
    firstName: 'Nick',
    email: 'nick@shield.com',
    password: 'password'
  }
]

const middleware = {
  isUserValid(username, password) {
    const user = users.find( user => user.email === username && user.password === password )
    return user
  },

  isAuthenticated(req, res, next) {
    if (req.session.username) return next() 
    else {
      res.redirect('/login')
    }
  }
}

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SECRET,
  cookie: {
    maxAge: 6000000,
    secure: false,
    httpOnly: true
  },
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI
   }),
  resave: false,
  saveUninitialized: false
}))

app.route('/').get(
  middleware.isAuthenticated,
  (req, res) => res.render('index', { name: req.session.username })
  )

app.route('/login').get(
  (req, res) => {
    res.render('login')
  }
)

app.route('/login').post((req, res) => {
  const { email, password } = req.body
  const user = middleware.isUserValid(email, password)
  if (user) {
    req.session.regenerate(err => {
      if (err) next(err)
    })

    req.session.username = user.firstName

    req.session.save(err => {
      if(err) next(err)
      res.render('index', { name: req.session.username })
    })
  }
})

app.route('/logout').get(
  (req, res) => {
    req.session.username = null
    req.session.save(err => {
      if (err) {
        return next(err)
      }

      req.session.regenerate((err) => {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })
  }
)

app.listen(PORT, () => console.log(`Express is listening on localhost:${PORT}`))

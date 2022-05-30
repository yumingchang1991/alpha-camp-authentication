const express = require('express')
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

const utility = {
  isUserValid(username, password) {
    const user = users.find( user => user.email === username && user.password === password )
    return user
  }
}

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.route('/').get((req, res) => {
  res.render('index')
})

app.route('/login').post((req, res) => {
  const { email, password } = req.body
  const user = utility.isUserValid(email, password)
  if (user) {
    res.send(`<h1>Welcome back, ${user.firstName}`)
    return
  }
  console.log('authentication failed')
  res.redirect('/')
})

app.listen(PORT, () => console.log(`Express is listening on localhost:${PORT}`))

const express = require('express')
const pgp = require('pg-promise')()
const cors = require('cors')
const bodyParser = require('body-parser')

const dbPassword = process.env.DB_PASSWORD
const dbUser = process.env.DB_USER

const db = pgp(`postgres://${dbUser}:${dbPassword}@35.247.196.137:5432/rvendas`)

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

let path = __dirname.replace('src', 'dist')
app.use('/', express.static(path))

app.get('/product', (req, res) => {
  db.any('select p.id, p.name, p.stock, json_agg(pp.name order by pp.id) as "forma_de_pagamento", json_agg(pp.price) as "price" from product p join product_price pp on p.id = pp.product_id group by p.id')
    .then(data => {
      res.json(data)
    })
    .catch(error => {
      res.json({ error })
    })
})

app.put('/product/:id', (req, res) => {
  const { id } = req.params
  const { name, stock, price, selectedPayment } = req.body

  db.none('update product set name = $1, stock = $2 where id = $3', [name, stock, id])
    .then(() => {
      db.none('update product_price set price = $1 where product_id = $2 and name = $3', [price, id, selectedPayment])
        .then(() => {
          res.json({ success: true })
        })
        .catch(error => {
          res.json({ error })
        })
    })
    .catch(error => {
      res.json({ error })
    })
})

app.get('/customer', (req, res) => {
  db.any('select id, name, street_address, neighborhood, house_number, phone_number  from customer')
    .then(data => {
      res.json(data)
    })
    .catch(error => {
      res.json({ error })
    })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)

})


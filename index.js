
const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')

const People = require('./models/person')

app.use(bodyParser.json())
const cors = require('cors')

const morgan = require('morgan')
app.use(express.static('build'))

app.use(cors())


morgan.token('post', (req, res) => {
    const body = req.body
    if (!body.name) {
        return 
    }
    return `{"name": "${body.name}", "number":"${body.number}}"`
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :post'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendick",
        number: "39-23-6423122",
        id: 4
    }
]


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new People({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    People.countDocuments({}, (error, count) => {
        if (error) {
            response.send(error)
        } else {
            response.send(`<h3>${Date()}</h3>
            <p>Puhelinluettelossa ${count} henkilön tiedot</p>`)
        }
    })

})

app.get('/api/persons', (request, response) => {
    People.find({}).then(peoples => {
        response.json(peoples.map(people => people.toJSON()))
    })
    .catch(error => next(error))
})



app.get('/api/persons/:id', (request, response, next) => {
    People.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(204).end()
            }
        
        })
        .catch(error => next(error))
})
        

app.delete('/api/persons/:id', (request, response, next) => {
    People.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    People.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
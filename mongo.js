const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give response as argument')
    process.exit()
}

const password = process.argv[2]
const url = `mongodb+srv://hikiantti:${password}@cluster0-6jcqj.mongodb.net/people-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const People = mongoose.model('People', personSchema)

if(process.argv.length < 4) {
    People.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const person = new People({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    })
}


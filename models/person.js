const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
	// eslint-disable-next-line no-unused-vars
	.then(_result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log(`error connecting to MongoDB: ${error.message}`)
	})


const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		unique: true,
		required: true

	},
	number: {
		type: String,
		minlength: 8,
		required: true
	}
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject.id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('People', personSchema)
require('dotenv').config();

const mongoose = require('mongoose');
const URI = process.env.mongoDB;
	
const connectDB = async () => {
	try {
		await mongoose.connect(URI, {
			useNewUrlParser    : true,
			useCreateIndex     : true,
			useFindAndModify   : false,
			useUnifiedTopology : true
		});
		console.log('MongoDB Connected!');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;

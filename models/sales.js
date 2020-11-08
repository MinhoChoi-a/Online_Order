const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    
    customer      : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'customer'
    },
    
	order_date  : {
		type : Date, //String => new Date('yyyy-mm-ddThh:mm:ss');
	},

	delivery_option : {
		type: String
	},

	address: {
		type: String
	},

	purchase : [
		{
			product        : {
				type     : String, // UNTAPPD BID
				required : true
			},

			amount      : {
				type     : Number,
				required : true
            },
            
			price  : {
				type     : Number,
				required : true
			}
		}
	],

	delivery_fee: {
		type: Number

	},
	
	total_price: {
		type	: Number
	}
    
});

module.exports = mongoose.model('sales', SalesSchema);

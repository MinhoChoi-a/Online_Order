const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    
    customer      : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'customer'
    },
    
	order_date  : {
		type : String, //String => new Date('yyyy-mm-ddThh:mm:ss');
	},

	delivery_option : {
		type: String
	},

	purchase : [
		{
			type	: {
				type     : String,
				required : true
			},
			
			item_name        : {
				type     : String,
				required : true
			},

			amount      : {
				type     : Number,
				required : true
            },
            
			price  : {
				type     : Number,
				required : true
			},
			
			set_value  : {
				type     : Number,
				required : true
			},

			taste_set  : {
				type     : String,
				required : false
			}
		}
	],

	address: {
		type	: String
	},

	delivery_fee: {
		type	: Number
	},
	
	total_price: {
		type	: String
	}
    
});

module.exports = mongoose.model('sales', SalesSchema);

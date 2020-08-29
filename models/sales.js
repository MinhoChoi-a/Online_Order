const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    
    customer      : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'customer'
    },
    
	order_date  : {
		type : Date,
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
    ]
    
});

module.exports = mongoose.model('sales', SalesSchema);

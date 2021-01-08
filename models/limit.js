const mongoose = require('mongoose');

const LimitSchema = new mongoose.Schema({
    
    date  : {
		type : Number,
    },
    
    day_num  : {
		type : Number,
	  },

	  dacq_limit : {
			type: Number,
    },
    
    cake_limit : {
        type: Number,
    },

    pickup_time : [
      {
        timeline: { type: String },
        limit: { type: Number }
      }
    ],

    delivery_time: {
      type: String
    }
    
    
});

module.exports = mongoose.model('limit', LimitSchema);

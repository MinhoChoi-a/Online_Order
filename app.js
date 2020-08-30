require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
const async = require('async');

const bodyParser = require('body-parser');

const item_list = require('./public/db/items.json');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'pug');

const fs = require('fs');
const csv = require('csv-parser');

var mongoose = require('mongoose');
var mongoDB = process.env.mongoDB;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Limit = require('./models/limit');
const Customer = require('./models/customer');
const Sales = require('./models/sales');
const { Console } = require('console');

app.use('/', router);

var cake_num = 0;
var dacq_num = 0;

var cake_list = [];
var dacq_list = [];

//mongoose get array which dac and cake limit are 0

router.get('/', function (req, res) {
  
  cake_list = [];
  dacq_list = [];

  for(var i =0; i < item_list.length; i++) {
    if(item_list[i].type == 'cake') {
      cake_list.push(item_list[i].item_name);
    }
  
    else if(item_list[i].type == 'dacq') {
      dacq_list.push(item_list[i].item_name);
    }
  }
  
  res.render('index');
});

router.get('/end', function (req, res) {

  res.render('end');

});

router.get('/order', function (req, res) {

  async.parallel({
        
    limits: function(callback) {
            Limit.find({})
         .where('date')
         .gte(20200801)
         .lt(20201031)
         .exec(callback);
        },
    }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Limit not found');
            err.status = 404;
            return next(err);
        }
       
    res.render('order', {limit_data: results.limits});
  });
});


router.post('/order', async function (req, res) {

  cake_num = 0;
  dacq_num = 0;

  var date = req.body.schedule;
  date = date.split(' ');
  date = '2020'+date[0]+date[2];

  console.log(date);

  try{
    let order_info = [];
    let sold_items = [];

    for(var prop in req.body) {
      order_info.push(req.body[prop]);
    }

    let email_content =
    "<body><div class='order_confirm'>"+
       "<h3>Order</h3>"+
       "<table>"+
         `<tr><td>Schedule</td><td>${order_info[0]}</td></tr>`+
         `<tr><td>Name</td><td>${order_info[1]}</td></tr>`+
         `<tr><td>insta/email</td><td>${order_info[2]}</td></tr>`+
         `<tr><td>Phone</td><td>${order_info[3]}</td></tr>`+
         `<tr><td>Allergy</td><td>${order_info[4]}</td></tr>`+
         `<tr><td>Delivery Option</td><td>${order_info[5]}</td></tr>`;
    
    let sold_content = '<table><tr><td>Product</td><td>Amount</td><td>Price</td></tr>';     

    if(order_info[5] == "delivery")  {
      email_content +=
      `<tr><td>Address</td><td>${order_info[6]}</td></tr></table>`;

        var i = 7;

        while(i < order_info.length-2) {
          let item = {
            product: order_info[i],
            amount: order_info[++i],
            price: order_info[++i],
          }

          if(dacq_list.includes(item.product)) {
            dacq_num += parseInt(item.amount);
          }

          if(cake_list.includes(item.product)) {
            cake_num += parseInt(item.amount);
          }

          sold_content +=
          `<tr><td>${item.product}</td><td>${item.amount}</td><td>${item.price}</td></tr>`;

          sold_items.push(item);

          i++;
        }

        let delivery_fee = '';
        let total_sum = '';

        if(order_info[i+1] == undefined){
          delivery_fee = 0;
          total_sum = order_info[i];
        }

        else {
          total_sum = order_info[i+1];
          delivery_fee = order_info[i];
        }
                
        sold_content +=
        `<tr><td colspan=2>Delivery Fee</td><td>${delivery_fee}</td>`+
        `<tr><td colspan=2>Total Sum</td><td>${total_sum}</td></tr></table>`;
      }

    else {
      email_content += "</table>"    
      
      var i = 6;

        while(i < order_info.length-1) {
          let item = {
            product: order_info[i],
            amount: order_info[++i],
            price: order_info[++i],
          }

          if(dacq_list.includes(item.product)) {
            dacq_num += parseInt(item.amount);
          }

          if(cake_list.includes(item.product)) {
            cake_num += parseInt(item.amount);
          }

          sold_content +=
          `<tr><td>${item.product}</td><td>${item.amount}</td><td>${item.price}</td></tr>`;

          sold_items.push(item);

          i++;
        }

        sold_content +=
        `<tr><td colspan=2>Total Sum</td><td>${order_info[i]}</td></tr></table>`;

      }

  let final_content = email_content + sold_content + "</div></body>";
  
  const comeback_user = await Customer.findOne({$and: [{name: order_info[1]},{phone: order_info[3]}]});

  if(!comeback_user) {
           
          var customer_info = {
            name: order_info[1],
            insta_email: order_info[2],
            phone: order_info[3],
            allergy: order_info[4]            
          }

          var new_customer = new Customer(customer_info);
              new_customer.save(function (err) {
							if(!err) {
                console.log(new_customer._id);
                console.log("new customer info added");
                
                var sales_info = {
                  customer: new_customer._id,
                  order_date: new Date(),
                  purchase: sold_items
                }
                
                var new_sales = new Sales(sales_info);
                new_sales.save(function (err) {
                  if(!err) {
                    console.log(new_sales._id);
                    console.log("sales info added");

                    console.log(date);

                    async.parallel({
                      
                      limit: function(callback) {
                      
                        Limit.find({date: date})
                            .exec(callback)
                      }}, async (err, results) => {
                        if(err) {console.log(err.message);}
                        else{
                          console.log(results);
                          
                          console.log(cake_num);
                          console.log(dacq_num);

                          var cake_limit = results.limit[0].cake_limit - cake_num;
                          var dacq_limit = results.limit[0].dacq_limit - dacq_num;

                          console.log(dacq_limit);
                          console.log(cake_limit);

                          results.limit[0].cake_limit = cake_limit;
                          results.limit[0].dacq_limit = dacq_limit;

                          console.log(results.limit[0].dacq_limit);

                          let update = await Limit.findByIdAndUpdate(results.limit[0]._id, results.limit[0], {});
                          
                          res.redirect('/end');
                        }
                      })
                  }                  
                })
                }
              });
          }    
  
  else {
      var sales_info = {
        customer: comeback_user._id,
        order_date: new Date(),
        purchase: sold_items
      }
      
      var new_sales = new Sales(sales_info);
      new_sales.save(function (err) {
        if(!err) {
          console.log(new_sales._id);
          console.log("comeback customer");
          console.log("sales info added");         
        }
     });   
  }

} catch(err) {
    console.log(err.message);
}
  
  
});


router.get('/management', (req,res) => {
	res.render('management');
});

router.post('/management', (req,res) => {
	
	var limit_data = [{

		date: '',
		day_num: '',
		dacq_limit: '',
		cake_limit: ''
		
	}];
	
	//CSV is much easier to manage data than txt.
	fs.createReadStream('./public/db/limit.csv')
		.pipe(csv()) //to use this we need csv-parser module
		.on('data', (row) => {
			limit_data.push(row);			
		})
		.on('end', () => {
      console.log(limit_data);
      console.log("finished to load csv");
      
      var n = 1;

			while(n < limit_data.length) {

          var limit = new Limit(limit_data[n]);
          
          //save on mongo
          limit.save(function (err) {
          if(!err) {
            console.log("mongo success");
            }
          });
          
          n++;
          };
  
          console.log('finished conversion');
          res.redirect('back');
          
		})				
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
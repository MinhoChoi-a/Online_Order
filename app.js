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

const nodemailer = require('nodemailer');
const { error } = require('console');
let transporter = nodemailer.createTransport({
    service: 'gmail', //https://myaccount.google.com/lesssecureapps
    auth: {
      user: process.env.mail_account,
      pass: process.env.mail_pass
    }
});

let mailOptions = {
  from: process.env.mail_account,
  to: 'bakingbunny.yyc@gmail.com',
  subject: '',
  html: ''
}

let cake_list = [];
let dacq_list = [];

app.use('/', router);

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/end/eng', function (req, res) {

  res.render('end_eng');

});

router.get('/end/kor', function (req, res) {

  res.render('end_kor');

});

router.get('/order/eng', function (req, res) {

  cake_list = [];
  dacq_list = [];

  for(var i =0; i < item_list.length; i++) {
    if(item_list[i].type == 'cake'|| item_list[i].type == 'custom-cake') {
      cake_list.push(item_list[i].item_name);
    }
  
    else if(item_list[i].type == 'dacquoise') {
      dacq_list.push(item_list[i].item_name);
    }
  }

  async.parallel({
        
    limits: function(callback) {
            Limit.find({})
         .where('date')
         .gte(20200801)
         .lt(20201231)
         .exec(callback);
        },
    }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Limit not found');
            err.status = 404;
            return next(err);
        }
       
    res.render('order_eng', {limit_data: results.limits});
  });
});


router.post('/order/eng', async function (req, res) {

  let cake_num = 0;
  let dacq_num = 0;

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
       "<h3>Order Request</h3>"+
       "<table style='background: rgba(248, 227, 222, 0.6); width:350px; padding: 5px;'>"+
         `<tr><td>Schedule</td><td>${order_info[0]}</td></tr>`+
         `<tr><td>Name</td><td>${order_info[1]}</td></tr>`+
         `<tr><td>insta/email</td><td>${order_info[2]}</td></tr>`+
         `<tr><td>Phone</td><td>${order_info[3]}</td></tr>`+
         `<tr><td>Allergy</td><td>${order_info[4]}</td></tr>`+
         `<tr><td>Delivery Option</td><td>${order_info[5]}</td></tr>`;
    
    let sold_content = '<table style="margin-top:10px; background: rgba(248, 227, 222, 0.6); width:350px; padding: 5px;"><tr><td>Product</td><td style="text-align:center">Amount</td><td style="text-align:center">Price</td></tr>';     

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

          let item_exact_name = item.product.split(' ');

          console.log(item_exact_name);

          if(dacq_list.includes(item_exact_name[0])) {
            dacq_num += parseInt(item.amount);
          }

          if(cake_list.includes(item_exact_name[0])) {
            cake_num += parseInt(item.amount);
          }

          sold_content +=
          `<tr><td>${item.product}</td><td style="text-align:center">${item.amount}</td><td style="text-align:center">${item.price}</td></tr>`;

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
        `<tr><td colspan=2>Delivery Fee</td><td style="text-align:center">${delivery_fee}</td>`+
        `<tr><td colspan=2>Total</td><td style="text-align:center">${total_sum}</td></tr></table>`;
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

          let item_exact_name = item.product.split(' ');

          console.log(item_exact_name);

          if(dacq_list.includes(item_exact_name[0])) {
            dacq_num += parseInt(item.amount);
          }

          if(cake_list.includes(item_exact_name[0])) {
            cake_num += parseInt(item.amount);
          }

          sold_content +=
          `<tr><td>${item.product}</td><td style="text-align:center">${item.amount}</td><td style="text-align:center">${item.price}</td></tr>`;

          sold_items.push(item);

          i++;
        }

        sold_content +=
        `<tr><td colspan=2>Total</td><td style="text-align:center">${order_info[i]}</td></tr></table>`;

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
                          
                          mailOptions.subject = 'Baking Bunny Order '+Date();
                          mailOptions.html = final_content;

                          transporter.sendMail(mailOptions, function() {
                            if(err) {console.log(err.meesage);}
                            
                            else {
                              console.log('Success Email');
                              res.redirect('/end/eng');
                            }
                          
                          });
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
                
                mailOptions.subject = 'Baking Bunny Order-Comeback Customer'+Date();
                mailOptions.html = final_content;

                transporter.sendMail(mailOptions, function() {
                  if(err) {console.log(err.meesage);}
                  
                  else {
                    console.log('Success Email');
                    res.redirect('/end/eng');
                  }
                          
                });
              }
            })
        }                  
      })
    }
  } catch(err) {
    console.log(err.message);
  }
});

router.get('/order/kor', function (req, res) {

  cake_list = [];
  dacq_list = [];

  for(var i =0; i < item_list.length; i++) {
    if(item_list[i].type == 'cake'|| item_list[i].type == 'custom-cake') {
      cake_list.push(item_list[i].item_name);
    }
  
    else if(item_list[i].type == 'dacquoise') {
      dacq_list.push(item_list[i].item_name);
    }
  }

  async.parallel({
        
    limits: function(callback) {
            Limit.find({})
         .where('date')
         .gte(20200801)
         .lt(20201231)
         .exec(callback);
        },
    }, function(err, results) {
        if(err) {return next(err);}
        if(results==null) {
            var err = new Error('Limit not found');
            err.status = 404;
            return next(err);
        }
       
    res.render('order_kor', {limit_data: results.limits});
  });
});


router.post('/order/kor', async function (req, res) {

  let cake_num = 0;
  let dacq_num = 0;

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

    console.log(order_info);

    let email_content =
    "<body><div class='order_confirm'>"+
       "<h3>Order Request</h3>"+
       "<table style='background: rgba(248, 227, 222, 0.6); width:350px; padding: 5px;'>"+
         `<tr><td>Schedule</td><td>${order_info[0]}</td></tr>`+
         `<tr><td>Name</td><td>${order_info[1]}</td></tr>`+
         `<tr><td>insta/email</td><td>${order_info[2]}</td></tr>`+
         `<tr><td>Phone</td><td>${order_info[3]}</td></tr>`+
         `<tr><td>Allergy</td><td>${order_info[4]}</td></tr>`+
         `<tr><td>Delivery Option</td><td>${order_info[5]}</td></tr>`;
    
    let sold_content = '<table style="margin-top:10px; background: rgba(248, 227, 222, 0.6); width:350px; padding: 5px;"><tr><td>Product</td><td style="text-align:center">Amount</td><td style="text-align:center">Price</td></tr>';     

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

          let item_exact_name = item.product.split(' ');

          console.log(item_exact_name);

          if(dacq_list.includes(item_exact_name[0])) {
            dacq_num += parseInt(item.amount);
          }

          if(cake_list.includes(item_exact_name[0])) {
            cake_num += parseInt(item.amount);
          }

          sold_content +=
          `<tr><td>${item.product}</td><td style="text-align:center">${item.amount}</td><td style="text-align:center">${item.price}</td></tr>`;

          sold_items.push(item);

          i++;
        }
        
        console.log(order_info);

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
        `<tr><td colspan=2>Delivery Fee</td><td style="text-align:center">${delivery_fee}</td>`+
        `<tr><td colspan=2>Total Sum</td><td style="text-align:center">${total_sum}</td></tr></table>`;
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

          let item_exact_name = item.product.split(' ');

          console.log(item_exact_name);

          if(dacq_list.includes(item_exact_name[0])) {
            dacq_num += parseInt(item.amount);
          }

          if(cake_list.includes(item_exact_name[0])) {
            cake_num += parseInt(item.amount);
          }

          sold_content +=
          `<tr><td>${item.product}</td><td style="text-align:center">${item.amount}</td><td style="text-align:center">${item.price}</td></tr>`;

          sold_items.push(item);

          i++;
        }

        sold_content +=
        `<tr><td colspan=2>Total Sum</td><td style="text-align:center">${order_info[i]}</td></tr></table>`;

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
                          
                          mailOptions.subject = 'Baking Bunny Order';
                          mailOptions.html = final_content;

                          transporter.sendMail(mailOptions, function() {
                            if(err) {console.log(err.meesage);}
                            
                            else {
                              console.log('Success Email');
                              res.redirect('/end/kor');
                            }
                          
                          });
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
                
                mailOptions.subject = 'Baking Bunny Order - comeback customer';
                mailOptions.html = final_content;

                transporter.sendMail(mailOptions, function() {
                  if(err) {console.log(err.meesage);}
                  
                  else {
                    console.log('Success Email');
                    res.redirect('/end/kor');
                  }
                          
                });
              }
            })
        }                  
      })
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
		//day_num: '',
		dacq_limit: '',
		cake_limit: ''
		
	}];
	
	//CSV is much easier to manage data than txt.
	fs.createReadStream('./public/db/limit_update.csv')
		.pipe(csv()) //to use this we need csv-parser module
		.on('data', (row) => {
			limit_data.push(row);			
		})
		.on('end', () => {
      console.log(limit_data);
      console.log("finished to load csv");
      
      var n = 1;

			while(n < limit_data.length) {

                   
          //save on mongo
          //var limit = new Limit(limit_data[n]);
          //limit.save(function (err) {
          
          //update mongo
          Limit.findOneAndUpdate({date: limit_data[n].date}, {$set: {dacq_limit: limit_data[n].dacq_limit, cake_limit: limit_data[n].cake_limit}}, function(err) {

          if(!err) {
            console.log("mongo success");
            }
          });
          
          n++;
          };
          
          console.log('finished update');
          //console.log('finished conversion');
          res.redirect('back');
          
		})				
});

router.post('/email', async function (req, res, next) {

  console.log(req.body.date);



  mailOptions.subject = 'Baking Bunny Inquiry from '+ req.body.name;
  mailOptions.html =
  `<h1> Inquiry Email </h1>`+
  `<div id='text' style="margin-top:10px; background: rgba(248, 227, 222, 0.6); width:350px; padding: 5px">` +
  `<p>${req.body.Message}</p>`+
  `<p>Needed date: `+ `${req.body.date}</p>`+
  `<p> Email address: `+ `${req.body.email}</p></div>`;
  
  try {
  await transporter.sendMail(mailOptions); } catch { console.log(err.message);}
    
  res.render('afterEmail', {text: 'Successfully sent E-mail.'});
  
})

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
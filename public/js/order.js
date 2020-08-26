/* Schedule Section*/

var today = new Date();
var today__num = today.getDay();

var nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
var fullDate = nextWeek.toISOString().slice(0,10);
var date = fullDate.split('-');
const availalbeDate = date[1]+date[2];

const calendar = document.querySelector('.calendar');
const schedule__date = document.querySelectorAll('.date');

window.onload=updateSchedule;

function updateSchedule() {
    for(var i = 0; i < schedule__date.length; i++ ) {
        
        if(today__num == 7) {
        
            if(schedule__date[i].id < availalbeDate) {
                schedule__date[i].style.background = 'black';
                schedule__date[i].setAttribute('disabled', 'disabled');
            }
        }

        //schedule__date[i].id == sold_out.date => style.background = "something" + disabled

        if( parseInt((schedule__date[i].id).substr(0,2)) == 1 + parseInt(availalbeDate.substr(0,2))) {
            schedule__date[i].style.background = 'orange';            
        }

        if( parseInt((schedule__date[i].id).substr(0,2)) == 2 + parseInt(availalbeDate.substr(0,2))) {
            schedule__date[i].style.background = 'red';
            schedule__date[i].setAttribute('disabled', 'disabled');
        }
    }
}

/* schedule select => menu section*/

const sales__limit = document.querySelector('.data').value;
var limit = JSON.parse(sales__limit);

const calendar_section = document.querySelector('.first');

const item_section = document.querySelector('.second');
const item_list = document.querySelector('.second .item__list');

const xmlhttp = new XMLHttpRequest();
const url = "../db/items.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        items = JSON.parse(this.responseText);
      }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

var today_limit = '';
var order_day_num = ''

calendar.addEventListener('click', e => {
    
    //make every input as default value
    //make every button, div a default display
    //make orderobjectarray as null
    //make customer_info as null
    //make delivery_fee as null

    var dac_items= [];
    var cake_items= [];
    today_limit = '';

    const targetWork = e.target.closest('button');

    var check = true;
    var i=0;
    
    while(check) {
        if(limit[i].date == targetWork.id) {
            check = false;
            today_limit = limit[i];
            order_day_num = limit[i].day_num;
        }
        i++;
    }
    
    for(var t= 0; t < items.length; t++) {
        if(items[t].type == 'cake') {
            cake_items.push(items[t]);
        }
        
        else if(items[t].type == 'dacq') {
            dac_items.push(items[t]);
        }
    }

    var available_data = [];

    if(today_limit.dac_limit != 0)
    {
        for(var i=0; i < dac_items.length; i++) {
            if(parseInt(targetWork.id) <= dac_items[i].close_date){
                available_data.push(dac_items[i]);
            }
        }
    }   

    if(today_limit.cake_limit != 0)
    {
        for(var i=0; i < cake_items.length; i++) {
            if(parseInt(targetWork.id) <= cake_items[i].close_date){
                available_data.push(cake_items[i]);
            }
        }
    }   
    
    var div = '';
    
    for(var i=0; i<available_data.length; i++) {
        
        if(available_data[i].type == 'cake') {

        var content = 
            `<ul class="item" id=${available_data[i].type}>
                <li id="image">
                    <img src="/img/${available_data[i].image}"/>
                </li>
                <li id="price" style="display:none">
                    <input type='number' value='${available_data[i].price}'/>       
                </li>
                <li id="name">${available_data[i].item_name}</li>
                <li id="amount">
                    <input type='number' value=1 min='0' max='${today_limit.cake_limit}'/>       
                </li>
                <li class="add_button" id="button_${available_data[i].item_name}">
                    <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                </li>
                <li class="fix_button" id="fixCart_${available_data[i].item_name}">
                    <button type="button" onclick="fixCart(this.parentElement)">Change Amount</button>
                </li>
            </ul>`;    
        }

        else {
         
        var content = 
            `<ul class="item" id=${available_data[i].type}>
                <li id="image">
                    <img src="/img/${available_data[i].image}"/>
                </li>
                <li id="price" style="display:none">
                    <input type='number' value='${available_data[i].price}'/>       
                </li>
                <li id="name">${available_data[i].item_name}</li>
                <li id="amount">
                    <input type='number' value=1 min=0 max='${today_limit.dac_limit}'/>       
                </li>
                <li class="add_button" id="button_${available_data[i].item_name}">
                    <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                </li>
                <li class="fix_button" id="fixCart_${available_data[i].item_name}">
                    <button type="button" onclick="fixCart(this.parentElement)">Change Amount</button>
                </li>
            </ul>`;    
        }
        
        div += content;
        }

        calendar_section.style.display = 'none';

        item_list.innerHTML = div;

        item_section.style.display = 'block';
    });

/* menu section*/

//important! global variable of order information
let orderObjectArray = [{
    item_name: '',
    amount: '',
    price: '',
}];

function getSumOrder() {
    
    var sum = 0;

    console.log(orderObjectArray);

    for(var i =1; i < orderObjectArray.length; i++) {
        sum += orderObjectArray[i].amount * orderObjectArray[i].price;
    }

    return sum;
}


const modal = document.querySelector(".modal");
const modal_content = document.querySelector(".modal__content");

var cake_total = 0;
var dacq_total = 0;

function addCart(p) {

    const amount_class = p.previousElementSibling;
    const title = amount_class.previousElementSibling.innerHTML;
    const price = parseFloat(amount_class.previousElementSibling.previousElementSibling.firstElementChild.value);
    const type = p.parentElement;
    const amount = parseInt(amount_class.firstElementChild.value);
    
    var content = `Succesfully added, you can add other items more, otherwise click the next button below`;

    if(type.id == 'cake') {
        cake_total += amount;
        
        if(cake_total > today_limit.cake_limit) {
            content = `Sorry, You cannot put cake more than ${today_limit.cake_limit}`;
            cake_total -= amount;
        }

        else{
            var newItem = {
                item_name: title,
                amount: amount,
                price: price
            }
            orderObjectArray.push(newItem); 

            var cartButton = document.querySelector(`#button_${title}`);
            cartButton.style.display = "none";

            var fixCartButton = document.querySelector(`#fixCart_${title}`);
            fixCartButton.style.display = "block";           

        }
    }

    else if(type.id == 'dacq') {
        dacq_total += amount;

        if(dacq_total > today_limit.dac_limit) {
            content = `Sorry, You cannot put dacq more than ${today_limit.dac_limit}`;
            dacq_total -= amount;
        }

        else{
            var newItem = {
                item_name: title,
                amount: amount,
                price: price
            }
            orderObjectArray.push(newItem); 

            var cartButton = document.querySelector(`#button_${title}`);
            cartButton.style.display = "none";
            
            var fixCartButton = document.querySelector(`#fixCart_${title}`);
            fixCartButton.style.display = "block";           
        }
    }

    modal_content.innerHTML = content;   
    modal.style.display = "flex";

}

window.onclick = function(e) {
    if(e.target == modal) {
    modal.style.display = "none";
    }
}

function fixCart(p) {

    const amount_class = (p.previousElementSibling).previousElementSibling;
    const title = amount_class.previousElementSibling.innerHTML;
    const type = p.parentElement;
    const amount = parseInt(amount_class.firstElementChild.value);

    var content = `Succesfully fixed, you can add other items more, otherwise click the next button below`;

    if(type.id == 'cake') {
        
            var check = false;
            var  i = 0;

            while(!check) {
                if(orderObjectArray[i].item_name === title) {
                    var difference = amount - orderObjectArray[i].amount;
                    cake_total += difference;
                    check = true;

                    if(cake_total > today_limit.cake_limit) {
                        content = `Sorry, You cannot put cake more than ${today_limit.cake_limit}`;
                        cake_total -= difference;
                    }

                    else {
                        orderObjectArray[i].amount = amount;
                    }

                }
                i++;
            }
        }
    
    else if(type.id == 'dacq') {
        
        var check = false;
        var  i = 0;

        while(!check) {
            if(orderObjectArray[i].item_name === title) {
                var difference = amount - orderObjectArray[i].amount;
                dacq_total += difference;
                check = true;

                if(cake_total > today_limit.dac_limit) {
                    content = `Sorry, You cannot put cake more than ${today_limit.dac_limit}`;
                    dacq_total -= difference;
                }

                else {
                    orderObjectArray[i].amount = amount;
                }

            }
            i++;
        }
    }
  
    modal_content.innerHTML = content;   
    modal.style.display = "flex";

}


/* menu section => customer */

const prev_schedule_button = document.querySelector('#prev__schedule');
//warning: it's gonna make every data as default value

const next_customer_button = document.querySelector('#next_customer');
const customer_section = document.querySelector('.third');

const pickup_button = document.querySelector('#pick');
const delivery_button = document.querySelector('#delivery');

const pickup_info = document.querySelector('.pickup_info');
const delivery_info = document.querySelector('.delivery_info');

next_customer_button.addEventListener('click', e => {

    item_section.style.display = 'none';
    customer_section.style.display = 'block';

    var sumOrder = getSumOrder();

    if (sumOrder < 50) {
        delivery_button.checked = false;
        delivery_info.style.display = "none";
    }

})

var customer_delivery_fee = ''

pickup_button.addEventListener('click', e => {
    
    delivery_info.style.display = "none";
    pickup_info.style.height = '200px'; 
    customer_delivery_fee = 0;

    let map = new google.maps.Map(pickup_info, {
        center: {lat: 51.0510542, lng: -114.0810167},
        zoom: 15,
        mapTypeControlOptions: {
          mapTypeIds: 'roadmap'
        },
        clickableIcons: false,
        draggableCursor:'default',// this is for cursor type
        minZoom: 7, // this is for min zoom for map
        maxZoom: 17, // this is for max zoom for map    
      });

    let marker = new google.maps.Marker({
        position: {lat: 51.0510542, lng: -114.0810167},
        map: map,
        title: "Pick-Up Location",
        // icon: {
        //   url: '../images/pin.svg',
        //   scaledSize: new google.maps.Size(40,40),
        // }
      });   
    
      var office_address = document.createElement("div");
      office_address.classList.add("office_address");
      const markup = "<h3>8st SW Calgary</h3>";
      office_address.innerHTML = markup;
      pickup_info.appendChild(office_address);
   
})

delivery_button.addEventListener('click', e => {
    
    zero_height();
    console.log(order_day_num);
    
    var order_sum = getSumOrder();

    console.log(order_sum);

    if(order_sum > 50) {

        if(order_day_num == 4 || order_day_num == 5 || order_day_num == 6) {
            setTimeout(function deliveryInput() {
                delivery_info.style.display = "block";
            }, 500);
        }

        else {
            var content = "Sorry delivery is avaiable only for Thursday ~ Saturday";
            delivery_button.checked = false;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
        }
        
    }

    else {
        var content = "Sorry you should buy more than $ 50";
            delivery_button.checked = false;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
    }
})

function zero_height() {
    pickup_info.style.height = '0px';
}

const address_check = document.querySelector('#address_check');
const post_code = document.querySelector('#postal');
const delivery_fee = document.querySelector('#delivery_fee');
const delivery_free = document.querySelector('#delivery_free');

address_check.addEventListener('click', e=> {
    e.preventDefault;

    delivery_free.style.display = 'none';
    delivery_fee.style.display = 'none';

    var code = post_code.value;

    console.log(code);

    var geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${code}&key=AIzaSyCq7_wnyksRIYf6kOhCQ555TDZT0TKoeQY`;

    fetch(geoCodeUrl)
      .then(response => response.json())
      .then(data => {
        
        var geocode = data.results[0].geometry.location;
        
        console.log(data.results[0]);
        
        var { lat, lng } = geocode;
        
        var long = parseFloat(lng);
        var lati = parseFloat(lat);
        
        var office = {long: -114.0803995, lati: 51.0503758}

        var service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [new google.maps.LatLng(office.lati, office.long)],
            destinations: [new google.maps.LatLng(lati, long)],
            travelMode: google.maps.TravelMode.DRIVING,
        }, function(response, status){
            
            var distance = response.rows[0].elements[0].distance.value;
            
            var city = data.results[0].address_components[2].short_name;
            //might need so do split ex) Northwest Calgary
            
            var content = '';

            console.log(distance);

            if(distance > 7500) {
                if(city != 'Calgary') {
                    
                    content = "Sorry this place is not available";
                    post_code.value = null;
                    modal_content.innerHTML = content;   
                    modal.style.display = "flex";
                    customer_delivery_fee = 0;
   
                }

                else {
                    delivery_fee.style.display = 'block';
                    customer_delivery_fee = 5;
                }
            }

            else {
                console.log(delivery_free);
                delivery_free.style.display = 'block';
                customer_delivery_fee = 0;
            }
        })

      
    });
})

const prev_items_button = document.querySelector('#prev__items');

prev_items_button.addEventListener('click', e => {
    customer_section.style.display = 'none';
    item_section.style.display = "block";
})

const next_check_button = document.querySelector('#next_check');

var customer_info = {
    name: '',
    insta: '',
    phone: '',
    allergy: '',
    delivery: '',
    address: '',
}


next_check_button.addEventListener('click', e =>{

    var name = document.querySelector('#cust_name').value;
    var insta = document.querySelector('#insta').value;
    var phone = document.querySelector('#phone').value;
    var allergy = document.querySelector('#allergy').value;
    var delivery = '';
    var address = '';
    
    var error_check = {
        check: false,
        message: ''        
    }


    if(pickup_button.checked == true) {
        delivery = 'pickup';
    }

    else if(delivery_button.checked == true) {

        if(post_code.value != null && post_code.value != '') {
            delivery = 'delivery';
            address = post_code.value;
        }

        else {
            error_check.check = true;
            error_check.message = 'address is empty';
        }
    }

    else {
        error_check.check = true;
        error_check.message = "didn't select the delivery option";
    }

    console.log(post_code.value);
    console.log(name);
    console.log(phone);

    if(name == null || phone == null || name == '' || phone == '' || name == 0 || phone == 0) {
        error_check.check = true;
        error_check.message = "name and phone should not be empty";
    }

    if(error_check.check == false) {

        customer_info = {name, insta, phone, allergy, delivery, address};

        console.log(customer_info);
        console.log(orderObjectArray);
        console.log(customer_delivery_fee);

        //what if users type the address, but didn't click the 'check address'
        //if postal code 'focus' => check address unactivated
        //check address button should be activated

    }

    else {
        
        var content = error_check.message;
        modal_content.innerHTML = content;   
        modal.style.display = "flex";
                    
    }

})


//show summary of order
//can change the number of items under today_limit
//nav => previous / confirm

//press confirm
//send e-mail
//make end_modal
//Thank you => click button => main page or baking bunny insta

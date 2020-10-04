/* Schedule Section*/
 var holiday = [
     20201004, 20201005, 20201012, 20201019, 20201026
 ];

var today = new Date();
var today__num = today.getDay();
var availableDate = '';


if(today__num == 7) {
    let closeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+8);
    let fullDate = closeDate.toISOString().slice(0,10);
    let date = fullDate.split('-');
    availalbeDate = date[0]+date[1]+date[2];
}

else {
    let available_day_duration = 7 - today__num;
    let closeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + available_day_duration+1);
    let fullDate = closeDate.toISOString().slice(0,10);
    let date = fullDate.split('-');
    availalbeDate = date[0]+date[1]+date[2];
}

const calendar = document.querySelector('.calendar');
const schedule__date = document.querySelectorAll('.date');

const sales__limit = document.querySelector('.data').value;
var limit = JSON.parse(sales__limit);

console.log(limit);

const sold_out_date = [];

window.onload=updateSchedule;

function updateSchedule() {

    for(var i =0; i <limit.length; i++) {
        if(limit[i].dacq_limit == 0 && limit[i].cake_limit == 0) {
            sold_out_date.push(limit[i].date);
        }
    }

    console.log(sold_out_date);

    for(var i = 0; i < schedule__date.length; i++ ) {
        
        if( parseInt((schedule__date[i].id).substring(4,6)) == parseInt(availalbeDate.substring(4,6))) {
            schedule__date[i].style.background = '#e6dae8';            
        }

        if( parseInt((schedule__date[i].id).substring(4,6)) == 1 + parseInt(availalbeDate.substring(4,6))) {
            schedule__date[i].style.background = '#fff8d4';            
        }

        /**
        if(schedule__date[i].id < availalbeDate) {
            schedule__date[i].style.background = '#fffdee';
             schedule__date[i].style.fontSize = '8px';
             schedule__date[i].innerHTML = 'closed';             
            schedule__date[i].setAttribute('disabled', 'disabled');
        }*/
        
        if(sold_out_date.includes(parseInt(schedule__date[i].id))) {
            schedule__date[i].style.background = '#f8e3de';
            schedule__date[i].style.fontSize = '10px';
            schedule__date[i].innerHTML = 'sold out';
            schedule__date[i].setAttribute('disabled', 'disabled');
        }

         if(holiday.includes(parseInt(schedule__date[i].id))) {
             schedule__date[i].style.background = '#fffdee';
             schedule__date[i].style.fontSize = '8px';
             schedule__date[i].innerHTML = 'closed';
             schedule__date[i].setAttribute('disabled', 'disabled');
         }
      
    }
}

/* schedule select => menu section*/

const calendar_section = document.querySelector('.first');

const item_section = document.querySelector('.second');
const item_list = document.querySelector('.second .item__list');
const cake_list = document.querySelector('.second .cake_list');
const dacq_list = document.querySelector('.second .dacq_list');

const alret_modal = document.querySelector('.alret_modal');

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
var order_day = '';

var cake_name_list = [];

calendar.addEventListener('click', async (e) => {
    
    //make every input as default value
    //make every button, div a default display
    //make orderobjectarray as null
    //make customer_info as null
    //make delivery_fee as null

    var dac_items= [];
    var cake_items= [];
    var custom_cake_items= [];

    today_limit = '';

    const targetWork = e.target.closest('button');
    order_day = targetWork.id;

    order_month = order_day.substring(4,6);

    var check = true;
    var i=0;
    
    console.log(limit[i].date);

    while(check) {
        if(parseInt(limit[i].date) == parseInt(targetWork.id)) {
            check = false;
            today_limit = limit[i];
            order_day_num = limit[i].day_num;
        }
        console.log(limit[i].date);
        console.log(targetWork.id);
        console.log(i);
        i++;
    }
    
    for(var t= 0; t < items.length; t++) {
        if(items[t].type == 'cake') {
            cake_items.push(items[t]);
        }

        else if(items[t].type == 'custom-cake') {
            custom_cake_items.push(items[t]);
        }
        
        else if(items[t].type == 'dacquoise') {
            dac_items.push(items[t]);
        }
    }

    console.log(dac_items[1].type);

    var available_data = [];

    if(today_limit.dacq_limit != 0) //might need to delete this condition to show every products
    {
        for(var i=0; i < dac_items.length; i++) {
            if(dac_items[i].available_date.includes(parseInt(targetWork.id))){
                available_data.push(dac_items[i]);
            }
        }
    }   

    if(today_limit.cake_limit != 0) //might need to delete this condition to show every products
    {
        for(var i=0; i < cake_items.length; i++) {
            if(cake_items[i].available_date.includes(parseInt(targetWork.id))){
                available_data.push(cake_items[i]);
            }
        }

        for(var i=0; i < custom_cake_items.length; i++) {
            if(custom_cake_items[i].available_date.includes(parseInt(targetWork.id))){
                available_data.push(custom_cake_items[i]);
            }
        }

    }   
    
    var cake_div = '';
    var dacq_div = '';
    var custom_cake_div = '';
    
    for(var i=0; i<available_data.length; i++) {
        
        if(available_data[i].type == 'cake') {
        
        cake_name_list.push(available_data[i].item_name);
        
        var cake_type = available_data[i].type;
        var cake_price = available_data[i].price;
        
        console.log(available_data[i].special);
        console.log(order_month);

        if(available_data[i].special == order_month) {
            cake_type = "monthly special cake";
            cake_price = available_data[i].price * 0.8;
        }

        var cake_content = 
            `<ul class="item" id=${available_data[i].type}>
                <li id="type">${cake_type}</li>
                <li id="image">
                    <img src="/img/${available_data[i].image}"/>    
                </li>
                <li id="name">
                    <div id="cake_name">${available_data[i].item_name}</div>
                    <div id="cake_size"><button type="button" class="set_size_cake" id="size_button_${available_data[i].item_name}" value="none"/>size select</div>
                </li>
                <li id="amount">
                    <div id="p">$ ${cake_price}</div>
                    <input type='number' value=1 min='0' max='${today_limit.cake_limit}'/>       
                </li>
                <li class="add_button" id="button_${available_data[i].item_name}">
                    <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                </li>
                <li class="fix_button" id="fixCart_${available_data[i].item_name}">
                    <button type="button" onclick="fixCart(this.parentElement)">Added</button>
                </li>
            </ul>`;
            
            cake_div += cake_content;
        }

        else if(available_data[i].type == 'custom-cake') {
        
            cake_name_list.push(available_data[i].item_name);
            
            var cake_type = available_data[i].type;
            var cake_price = available_data[i].price;
            
            if(available_data[i].special == order_month) {
                cake_type = "monthly special cake";
                cake_price = available_data[i].price * 0.8;
            }
    
            var cake_content = 
                `<ul class="item" id=${available_data[i].type}>
                    <li id="type">${cake_type}</li>
                    <li id="image">
                        <img src="/img/${available_data[i].image}"/>    
                    </li>
                    <li id="name">
                        <div id="cake_name">${available_data[i].item_name}</div>
                        <div id="cake_size"><button type="button" class="set_size_cake" id="size_button_${available_data[i].item_name}" value="none"/>size select</div>
                    </li>
                    <li id="amount">
                        <div id="p">$ ${cake_price}</div>
                        <input type='number' value=1 min='0' max='${today_limit.cake_limit}'/>       
                    </li>
                    <li class="add_button" id="button_${available_data[i].item_name}">
                        <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                    </li>
                    <li class="fix_button" id="fixCart_${available_data[i].item_name}">
                        <button type="button" onclick="fixCart(this.parentElement)">Added</button>
                    </li>
                </ul>`;
                
                custom_cake_div += cake_content;
            }

        else {
         
        var dacq_content = 
            `<ul class="item" id=${available_data[i].type}>
                <li id="type">${available_data[i].type}</li>
                <li id="image">
                    <img src="/img/${available_data[i].image}"/>
                </li>                
                <li id="name">
                    <div id="dacq_name">${available_data[i].item_name}</div>
                    <div id="dacq_size" style="display:none;"></div></li>
                <li id="amount">
                    <div id="p">$ ${available_data[i].price}</div>
                    <input type='number' value=1 min=0 max='${today_limit.dacq_limit}'/>       
                </li>
                <li class="add_button" id="button_${available_data[i].item_name}">
                    <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                </li>
                <li class="fix_button" id="fixCart_${available_data[i].item_name}">
                    <button type="button" onclick="fixCart(this.parentElement)">Added</button>
                </li>
            </ul>`;
            
            dacq_div += dacq_content;
        }
        
        
        }

        calendar_section.style.display = 'none';
        alret_modal.style.height = '100vh';

        //item_list.innerHTML = div;
        cake_list.innerHTML = await cake_div;
        cake_list.innerHTML += await custom_cake_div;
        dacq_list.innerHTML = await dacq_div;
        
        item_section.style.display = 'block';
    });

alret_modal.addEventListener('click', e => {
    alret_modal.style.height = 0;
})

/* menu section*/

//important! global variable of order information
let orderObjectArray = [{
    item_name: '',
    amount: '',
    price: '',
    set_value: '' //set_size_value & set_custom_value
}];

function getSumOrder() {
    
    var sum = 0;

    console.log(orderObjectArray);

    for(var i =1; i < orderObjectArray.length; i++) {
        sum += (orderObjectArray[i].amount) * (orderObjectArray[i].price) * (orderObjectArray[i].set_value);
        console.log(sum);
    }

    console.log(sum);

    return parseFloat(sum.toFixed(1));
}

const total__check = document.querySelector('.total_check');

const menu_modal = document.querySelector('.dessert_nav_modal');
const menu_modal_button = document.querySelector('.dessert_nav_modal_button');
//menu select

const modal = document.querySelector(".modal");
const modal_content = document.querySelector(".modal__content");

const size_modal = document.querySelector(".cake_size_modal");
const size_modal_content = document.querySelector(".cake_size_modal_content");


cake_list.addEventListener('click', e => {

    if(e.target.innerHTML == "size select") {
        size_modal_content.value = e.target.id;
        size_modal.style.height = '100vh';
    }
}
)

function sizeValue(value, id) {
    
    console.log(value);
    console.log(id);

    document.querySelector(`#${id}`).value = value;

    size_modal.style.height = 0;
}

var cake_total = 0;
var dacq_total = 0;

function addCart(p) {

    const amount_class = p.previousElementSibling;
    const title = amount_class.previousElementSibling.firstElementChild.innerHTML;
    const cake_set = amount_class.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild;
    const price_array = (amount_class.firstElementChild.innerHTML).split(' ');
    const price = parseFloat(price_array[1]).toFixed(2);
    const type = p.parentElement;
    const amount = parseInt(amount_class.firstElementChild.nextElementSibling.value);
    
    var content = `<p id='kor'>추가되었습니다. 다른 메뉴를 더 선택하시거나, 하단의 Next 버튼을 누르시고 다음 단계로 가셔도 됩니다.</p><p id='kor'>수정을 원하시면 수량을 변경하신 후 Added 버튼을 눌러주세요</p>`;

    if(type.id == 'cake') {
        cake_total += amount;
        
        if(cake_total > today_limit.cake_limit) {
            content = `<div id='kor'>죄송합니다, 이 날 가능한 케익의 수량은 총 ${today_limit.cake_limit} 개 입니다.</div>`;
            cake_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(cake_set.value == "none" || cake_set.value == undefined) {
            
            content = "<div id='kor'> 케익의 사이즈를 먼저 선택해 주세요 </div>";
            cake_total -= amount;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
        }

        else{
            
            var newItem = {
                item_name: title,
                amount: amount,
                price: price,
                set_value: cake_set.value
            }
            orderObjectArray.push(newItem); 

            var cartButton = document.querySelector(`#button_${title}`);
            cartButton.style.display = "none";

            cartButton.previousElementSibling.firstElementChild.innerHTML = "$ "+ (newItem.amount * newItem.price * newItem.set_value).toFixed(1);

            var fixCartButton = document.querySelector(`#fixCart_${title}`);
            fixCartButton.style.display = "block";
            
            var sum = getSumOrder()
            
            total__check.innerHTML = `<p>Total purchase ${sum}</p>`;
            total__check.style.height = '30px';

        }
    }

    else if(type.id == 'custom-cake') {
        cake_total += amount;
        
        content = 
        `<p id='kor'>추가되었습니다. Custom Cake의 경우 디자인에 따라 추가 요금이 발생할 수 있습니다. 정확한 가격 안내는 주문을 완료하시고 나면 이메일로 안내를 드릴 예정입니다.</p>`+
        `<p id='kor'>다른 메뉴를 더 선택하시거나, 하단의 Next 버튼을 누르시고 다음 단계로 가셔도 됩니다.</p><p id='kor'>수정을 원하시면 수량을 변경하신 후 Added 버튼을 눌러주세요</p>`;

        if(cake_total > today_limit.cake_limit) {
            content = `<div id='kor'>죄송합니다, 이 날 가능한 케익의 수량은 총 ${today_limit.cake_limit} 개 입니다.</div>`;
            cake_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(cake_set.value == "none" || cake_set.value == undefined) {
            
            content = "<div id='kor'> 케익의 사이즈를 먼저 선택해 주세요 </div>";
            cake_total -= amount;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
        }

        else{
            
            var newItem = {
                item_name: title,
                amount: amount,
                price: price,
                set_value: cake_set.value
            }
            orderObjectArray.push(newItem); 

            var cartButton = document.querySelector(`#button_${title}`);
            cartButton.style.display = "none";

            cartButton.previousElementSibling.firstElementChild.innerHTML = "$ "+ (newItem.amount * newItem.price * newItem.set_value).toFixed(1);

            var fixCartButton = document.querySelector(`#fixCart_${title}`);
            fixCartButton.style.display = "block";
            
            var sum = getSumOrder()
            
            total__check.innerHTML = `<p>Total purchase ${sum}</p>`;
            total__check.style.height = '30px';

        }
    }

    else if(type.id == 'dacquoise') {
        dacq_total += amount;

        if(dacq_total > today_limit.dacq_limit) {
            content = `<div id='kor'>죄송합니다, 이 날 가능한 다쿠아즈의 수량은 총 ${today_limit.dacq_limit} 개 입니다.</div>`;
            dacq_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else{
            var newItem = {
                item_name: title,
                amount: amount,
                price: price,
                set_value: 1
            }
            orderObjectArray.push(newItem); 

            var cartButton = document.querySelector(`#button_${title}`);
            cartButton.style.display = "none";
            
            cartButton.previousElementSibling.firstElementChild.innerHTML = "$ "+ (newItem.amount * newItem.price).toFixed(1);

            var fixCartButton = document.querySelector(`#fixCart_${title}`);
            fixCartButton.style.display = "block";
            
            var sum = getSumOrder()
            
            total__check.innerHTML = `<p>Total purchase ${sum}</p>`;
            total__check.style.height = '30px';
        }
    }

    console.log(orderObjectArray);

    modal_content.innerHTML = content;   
    modal.style.display = "flex";

}

const nav_all_button = document.querySelector('.nav_all');
const nav_cake_button = document.querySelector('.nav_cake');
const nav_dacq_button = document.querySelector('.nav_dacq');

modal.addEventListener('click', e => {
    modal.style.display = "none";
})

modal_content.addEventListener('click', e=> {
    modal.style.display = "none";
})


window.onclick = function(e) {
    if(e.target == modal) {
    modal.style.display = "none";
    }

    if(e.target == modal_content) {
    modal.style.display = "none";
    }

    if(e.target == menu_modal || e.target == menu_modal.firstElementChild) {
    menu_modal.style.height = '0vh';
    }
}

menu_modal_button.addEventListener('click', e => {
    menu_modal.style.height = '100vh';
})

nav_all_button.addEventListener('click', e=> {
    menu_modal.style.height = '0vh';
    cake_list.style.display = 'grid';
    dacq_list.style.display = 'grid';
})

nav_cake_button.addEventListener('click', e => {
    menu_modal.style.height = '0vh';
    cake_list.style.display = 'grid';
    dacq_list.style.display = 'none';
})

nav_dacq_button.addEventListener('click', e => {
    menu_modal.style.height = '0vh';
    dacq_list.style.display = 'grid';
    cake_list.style.display = 'none';
})


function fixCart(p) {

    const amount_class = (p.previousElementSibling).previousElementSibling;
    const title = amount_class.previousElementSibling.firstElementChild.innerHTML;
    const cake_set = amount_class.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild;
    const type = p.parentElement;
    const amount = parseInt(amount_class.firstElementChild.nextElementSibling.value);

    console.log(title);

    var content = "<div id='kor'> 수정되었습니다. </div>";

    if(type.id == 'cake' || type.id == 'custom-cake') {
        
            var check = false;
            var  i = 0;

            while(!check) {
                if(orderObjectArray[i].item_name === title) {
                    var difference = amount - orderObjectArray[i].amount;
                    cake_total += difference;
                    check = true;

                    if(cake_total > today_limit.cake_limit) {
                        content = `<div id='kor'>죄송합니다, 이 날 가능한 케익의 수량은 총 ${today_limit.cake_limit} 개 입니다.</div>`;
                        cake_total -= difference;
                        amount_class.firstElementChild.nextElementSibling.value = orderObjectArray[i].amount;
                    }

                    else {
                        orderObjectArray[i].amount = amount;
                        orderObjectArray[i].set_value = cake_set.value;
                        amount_class.firstElementChild.innerHTML = "$ "+ (orderObjectArray[i].amount * orderObjectArray[i].price *orderObjectArray[i].set_value).toFixed(1);

                        var sum = getSumOrder()
            
                        total__check.innerHTML = `<p>Total purchase ${sum}</p>`;
                        total__check.style.height = '30px';
                    }

                }
                i++;
            }
        }
    
    else if(type.id == 'dacquoise') {
        
        var check = false;
        var  i = 1;

        while(!check) {
            if(orderObjectArray[i].item_name === title) {
                var difference = amount - orderObjectArray[i].amount;
                
                console.log(difference);
                
                dacq_total += difference;
                check = true;

                if(dacq_total > today_limit.dacq_limit) {
                    content = `<div id='kor'>죄송합니다, 이 날 가능한 다쿠아즈의 수량은 총 ${today_limit.dacq_limit} 개 입니다.</div>`;
                    dacq_total -= difference;
                    amount_class.firstElementChild.nextElementSibling.value = orderObjectArray[i].amount;

                    console.log(amount_class.firstElementChild.nextElementSibling.value);
                }

                else {
                    orderObjectArray[i].amount = amount;
                    amount_class.firstElementChild.innerHTML = "$ "+ (orderObjectArray[i].amount * orderObjectArray[i].price).toFixed(1);

                    var sum = getSumOrder()
            
                    total__check.innerHTML = `<p>Total purchase ${sum}</p>`;
                    total__check.style.height = '30px';
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

    var sumOrder = getSumOrder();

    console.log(sumOrder);

    if(sumOrder == null || sumOrder == '' || sumOrder == 0) {
    
        var content = "<div id='kor'>메뉴를 선택해주세요</div>"
        modal_content.innerHTML = content;   
        modal.style.display = "flex";

    }

    else {

    if (sumOrder < 50) {
        delivery_button.checked = false;
        delivery_info.style.display = "none";
    }

        item_section.style.display = 'none';
        customer_section.style.display = 'block';


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
    const markup = "<p>Pick-up location</p>";
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
            var content = "<div id='kor'> 죄송합니다. 딜리버리는 목요일에서 토요일까지만 가능합니다.</div>";
            delivery_button.checked = false;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
        }
        
    }

    else {
        var content = "<div id='kor'> 죄송합니다. 딜리버리는 $ 50 이상 구매하셔야 가능합니다.</div>";
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
const delivery_error = document.querySelector('#delivery_error');

var address_check_validation = true;

post_code.addEventListener('focus', e=> {
    address_check_validation = false;
});

address_check.addEventListener('click', e=> {
    e.preventDefault;

    address_check_validation = true;

    delivery_free.style.display = 'none';
    delivery_fee.style.display = 'none';
    delivery_error.style.display = 'none';

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
            
            city = city.split(' ');

            var content = '';

            console.log(distance);

            if(distance > 5000) {
                if(!city.includes('Calgary')) {
                    
                    content = "<div id='kor'> 죄송합니다. 이 지역은 딜리버리가 불가능합니다.</div>";
                    post_code.value = null;
                    modal_content.innerHTML = content;   
                    modal.style.display = "flex";
                    customer_delivery_fee = 0;
   
                }

                else if(distance < 10000) {
                    delivery_fee.innerHTML = "<p> $3 additional delivery fee</p>" ;
                    delivery_fee.style.display = 'block';
                    customer_delivery_fee = 3;
                }

                else if(distance < 15000) {
                    delivery_fee.innerHTML = "<p> $5 additional delivery fee</p>";
                    delivery_fee.style.display = 'block';
                    customer_delivery_fee = 5;
                }

                else if(distance < 20000) {
                    delivery_fee.innerHTML = "<p> $7 additional delivery fee</p>";
                    delivery_fee.style.display = 'block';
                    customer_delivery_fee = 7;
                }

                else if(distance < 25000) {
                    delivery_fee.innerHTML = "<p> $10 additional delivery fee </p>";
                    delivery_fee.style.display = 'block';
                    customer_delivery_fee = 10;
                }

                else {
                    content = "<div id='kor'> 죄송합니다. 이 지역은 딜리버리가 불가능합니다.</div>";
                    post_code.value = null;
                    modal_content.innerHTML = content;   
                    modal.style.display = "flex";
                    customer_delivery_fee = 0;
                }

            }

            else {
                console.log(delivery_free);
                delivery_free.style.display = 'block';
                customer_delivery_fee = 0;
            }
        })
    })
    .catch(error => {
        post_code.value = null;
        delivery_error.style.display = 'block';
        customer_delivery_fee = 0;
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

const confirmation_section = document.querySelector('.fourth');

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

            if(!address_check_validation) {
                error_check.check = true;
                error_check.message = "<div id='kor'>Check Address 버튼을 꼭 눌러주세요</div>";
            }

        }

        else {
            error_check.check = true;
            error_check.message = "<div id='kor'>주소 칸이 비었습니다.</div>";
        }
    }

    else {
        error_check.check = true;
        error_check.message = "<div id='kor'>딜리버리 옵션을 선택해주세요</div>";
    }

    console.log(post_code.value);
    console.log(name);
    console.log(phone);

    if(name == null || phone == null || name == '' || phone == '' || name == 0 || phone == 0 ||
        insta == null || insta == '' || allergy == null || allergy == '') {
        error_check.check = true;
        error_check.message = "<div id='kor'>모든 내용을 적어주셔야 합니다.</div>";
    }

    if(error_check.check == false) {

        customer_info = {name, insta, phone, allergy, delivery, address};

        customer_section.style.display = 'none';
        confirmation_section.style.display = 'block';
        confirmation(customer_info, orderObjectArray, customer_delivery_fee);
        
    }

    else {
        
        var content = error_check.message;
        modal_content.innerHTML = content;   
        modal.style.display = "flex";
                    
    }

})

var day_list = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const customer_table = document.querySelector('.confirmation_customer');
const order_table = document.querySelector('.confirmation_order');

const prev_custom_button = document.querySelector('#prev__customer');

function confirmation(cust, ord, deliv) {

    var order_schedule = order_day.substring(4,6) + " / " + order_day.substring(6,8) + " "+ day_list[order_day_num - 1];

    var cust_info = 
    `<tr><td id="head">Schedule</td><td id="content"><input type="text" name="schedule" value="${order_schedule}" readonly/></td>`+
    `<tr><td id="head">Name</td><td id="content"><input type="text" name="name" value="${cust.name}" readonly/></td>`+
    `<tr><td id="head">Insta ID / Email</td><td id="content"><input type="text" name="insta" value="${cust.insta}" readonly/></td>`+
    `<tr><td id="head">Phone Number</td><td id="content"><input type="text" name="phone" value="${cust.phone}" readonly/></td>`+
    `<tr><td id="head">Allergy</td><td id="content"><input type="text" name="allergy" value="${cust.allergy}" readonly/></td>`+
    `<tr><td id="head">Delivery Option</td><td id="content"><input type="text" name="deliveryOption" value="${cust.delivery}" readonly/></td>`;

    if(cust.delivery == 'delivery') {
        cust_info += `<tr><td id="head">Address</td><td id="content"><input type="text" name="address" value="${cust.address}" readonly/></td>`;
    }

    customer_table.innerHTML = cust_info;

    var order_info = "<tr><td id='head'>Product</td><td id='head'>Qty</td><td id='head'>Price</td>";

    for(var i =1; i<ord.length; i++) {

        let size = ''

        if(cake_name_list.includes(ord[i].item_name)) {

        if(ord[i].set_value == 1) {
            size = ' 6 inch';
        }

        else if(ord[i].set_value == 1.2) {
            size = ' 8 inch';
        }
        
        }

        var div = 
        `<tr><td id="item"><input type="text" name="item_name_${i}" value="${ord[i].item_name}${size}" style="font-size:12px;" readonly/></td><td id="amount"><input type="text" name="amount_${i}" value="${ord[i].amount}" readonly/></td><td id="price"><input type="text" name="price_${i}" value="${(ord[i].price*ord[i].amount*ord[i].set_value).toFixed(1)}" readonly/></td>`;

        order_info += div;
    }

    var total_sum = getSumOrder();

    if(deliv > 0) {
        order_info +=
        `<tr><td id="head" colspan=2>Delivery Fee</td><td id="price"><input type="text" name="delivery_fee" value="${deliv}" readonly/></td>`;

        total_sum += parseInt(deliv);
    }

    order_info += `<tr><td id="head" colspan=2>Total($)</td><td id="price"><input type="text" name="total_sum" value="${total_sum}" readonly/></td>`;

    order_table.innerHTML = order_info;   

}

prev_custom_button.addEventListener('click', e=> {
    
    confirmation_section.style.display = 'none';
    customer_section.style.display = 'block';
});



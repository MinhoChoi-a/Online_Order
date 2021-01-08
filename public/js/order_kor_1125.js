/* Schedule Section*/

var closed_list = [20201130, 20201207, 20201214, 20201221, 20201228];

var holiday = [
    20201229, 20201230, 20201231, 20210101, 20210102, 20210103, 20210104
];

var christmas = [
    20201223, 20201224, 20201225, 20201226
];

var today = new Date();
var today__num = today.getDay();
var availalbeDate = '';

if(today__num == 1) {
    let closeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
    let fullDate = closeDate.toISOString().slice(0,10);
    let date = fullDate.split('-');
    availalbeDate = date[0]+date[1]+date[2];
}

else if(today__num ==0) {
    let closeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
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

//100&10
const sales__limit = document.querySelector('.data').value;
var limit = JSON.parse(sales__limit);

const sold_out_date = [];

window.onload=updateSchedule;

function updateSchedule() {

    for(var i =0; i <limit.length; i++) {
        if(limit[i].dacq_limit == 0 && limit[i].cake_limit == 0) {
            sold_out_date.push(limit[i].date);
        }
    }

    for(var i = 0; i < schedule__date.length; i++ ) {
        
        if( parseInt((schedule__date[i].id).substring(4,6)) == parseInt(availalbeDate.substring(4,6))) {
            schedule__date[i].style.background = '#e6dae8';            
        }

        if( parseInt((schedule__date[i].id).substring(4,6)) == 1 + parseInt(availalbeDate.substring(4,6))) {
            schedule__date[i].style.background = '#fff8d4';
        }

        if( parseInt((schedule__date[i].id).substring(4,6)) == 2 + parseInt(availalbeDate.substring(4,6))) {
            schedule__date[i].style.background = '#efdcbe';
        }

        if(schedule__date[i].id < availalbeDate) {
            schedule__date[i].style.background = '#ececec';
            schedule__date[i].style.fontSize = '10px';
            schedule__date[i].innerHTML = 'sold out';
            schedule__date[i].setAttribute('disabled', 'disabled');
        }
        
        if(sold_out_date.includes(parseInt(schedule__date[i].id))) {
            schedule__date[i].style.background = '#ececec';
            schedule__date[i].style.fontSize = '10px';
            schedule__date[i].innerHTML = 'sold out';
            schedule__date[i].setAttribute('disabled', 'disabled');
        }

        if(closed_list.includes(parseInt(schedule__date[i].id))) {
            schedule__date[i].style.background = '#fffdee';
            schedule__date[i].style.fontSize = '8px';
            schedule__date[i].innerHTML = 'closed';
            schedule__date[i].setAttribute('disabled', 'disabled');
        }

        if(holiday.includes(parseInt(schedule__date[i].id))) {
             schedule__date[i].style.background = '#f8f4ec';
             schedule__date[i].style.fontSize = '7px';
             schedule__date[i].innerHTML = 'holiday';
             schedule__date[i].setAttribute('disabled', 'disabled');
         }

         if(christmas.includes(parseInt(schedule__date[i].id))) {
            schedule__date[i].style.background = '#f19e9d';
         }
      
    }
}

/* schedule select => menu section*/
const calendar_section = document.querySelector('.first');

const item_section = document.querySelector('.second');

const item_list = document.querySelector('.second .item__list');
const cake_list = document.querySelector('.second .cake_list');
const dacq_list = document.querySelector('.second .dacq_list');

const menu_modal = document.querySelector('.dessert_nav_modal');
const menu_modal_button = document.querySelector('.dessert_nav_modal_button');

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

calendar.addEventListener('click', (e) => {
    
    today_limit = '';

    const targetWork = e.target.closest('button');
    order_day = targetWork.id;

    order_month = order_day.substring(4,6);

    var check = true;
    var i=0;
    
    while(check) {
        if(parseInt(limit[i].date) == parseInt(targetWork.id)) {
            check = false;
            today_limit = limit[i];
            order_day_num = limit[i].day_num;
        }
        i++;
    }
    
    var cake_div = '';
    var dacq_div = '';
    var custom_cake_div = '';

    for(var t= 0; t < items.length; t++) {
      
        if(items[t].available_date.includes(parseInt(targetWork.id))) {

        if(items[t].type == 'cake') {
        
            cake_name_list.push(items[t].item_name_kor);
        
            var cake_type = items[t].type;
        
            var cake_price = items[t].price;
        
                if(items[t].special == order_month) {
                    cake_type = "monthly special cake";
                    cake_price = available_data[i].price * 0.8;
                }

            var cake_content = 
                `<ul class="item" id=${cake_type}>
                    <li id="type">${cake_type}</li>
                    <li id="image">
                        <img id="img" src="/img/${items[t].image}"/>    
                    </li>
                    <li id="name">
                        <div id="cake_name" style="font-family:'Noto Serif KR', serif;">${items[t].item_name_kor}</div>
                        <div id="cake_size"><button type="button" class="set_size_cake" id="size_button_${items[t].item_name_kor}" value="none"/>option select</div>
                        <input id="taste_size_button_${items[t].item_name_kor}" type="hidden" value=${items[t].tastes_kor}>
                    </li>
                    <li id="amount">
                        <div id="p">$ ${cake_price}</div>
                        <input type='number' value=1 min='0' max='${today_limit.cake_limit}'/>       
                    </li>
                    <li class="add_button" id="button_${items[t].item_name_kor}">
                        <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                    </li>
                    <li class="fix_button" id="fixCart_${items[t].item_name_kor}">
                        <button type="button" onclick="fixCart(this.parentElement)">Added</button>
                    </li>
                </ul>`;
                
                cake_div += cake_content;
            
            }
        
            else if(items[t].type == 'custom-cake') {
        
                //cake_name_list.push(items[t].item_name_kor);
                
                var cake_type = items[t].type;
                var cake_price = items[t].price;
                
            if(cake_price !=0) {
    
                var cake_content = 
                    `<ul class="item" id=${cake_type}>
                        <li id="type">${cake_type}</li>
                        <li id="image">
                            <img id="img" src="/img/${items[t].image}"/>    
                        </li>
                        <li id="name">
                            <div id="cake_name" style="font-family:'Noto Serif KR', serif;">${items[t].item_name_kor}</div>
                            <div id="cake_size"><button type="button" class="set_size_cake" id="size_button_${items[t].item_name_kor}" value="none"/>size select</div>
                        </li>
                        <li id="amount">
                            <div id="p">$ ${cake_price}</div>
                            <input type='number' value=1 min='0' max='${today_limit.cake_limit_kor}'/>       
                        </li>
                        <li class="add_button" id="button_${items[t].item_name_kor}">
                            <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                        </li>
                        <li class="fix_button" id="fixCart_${items[t].item_name_kor}">
                            <button type="button" onclick="fixCart(this.parentElement)">Added</button>
                        </li>
                    </ul>`; }
    
                    else {
                        var cake_content = 
                        `<ul class="item" id=${cake_type}>
                            <li id="type">${cake_type}</li>
                            <li id="image">
                                <img id="img" src="/img/${items[t].image}"/>    
                            </li>
                            <li id="name">
                                <div id="cake_name">${items[t].item_name_kor}</div>
                            </li>                
                            <li class="inq_button">
                                <button type='button' onclick="cake__inquiry()" class="inquiry" style="height:45px;">Inquiry</button>                    
                            </li>                
                        </ul>`;
                    }
                    
                    custom_cake_div += cake_content;
                }
        
                else if(items[t].type == 'dacquoise') {
        
                    var dacq_content = 
                    `<ul class="item" id=${items[t].type}>
                        <li id="type">${items[t].type}</li>
                        <li id="image">
                            <img id="img" src="/img/${items[t].image}"/>
                        </li>                
                        <li id="name">
                            <div id="dacq_name" style="font-family:'Noto Serif KR', serif;">${items[t].item_name_kor}</div>
                            <div id="dacq_size" style="display:none;"></div></li>
                        <li id="amount">
                            <div id="p">$ ${items[t].price}</div>
                            <input type='number' value=1 min=0 max='${today_limit.dacq_limit}'/>       
                        </li>
                        <li class="add_button" id="button_${items[t].item_name_kor}">
                            <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                        </li>
                        <li class="fix_button" id="fixCart_${items[t].item_name_kor}">
                            <button type="button" onclick="fixCart(this.parentElement)">Added</button>
                        </li>
                    </ul>`;
                    
                    dacq_div += dacq_content;
                }

                else if(items[t].type == 'dacquoise-set') {
        
                    var dacq_content = 
                    `<ul class="item" id=${items[t].type}>
                        <li id="type">${items[t].type}</li>
                        <li id="image">
                            <img id="img" src="/img/${items[t].image}"/>
                        </li>                
                        <li id="name">
                            <div id="dacq_name" style="font-family:'Noto Serif KR', serif;">${items[t].item_name_kor}</div>
                            <div id="dacq_taste"><button type="button" class="dacq_taste" id="dacq_taste_${items[t].item_name_kor}" value="none"/>taste select</div>
                            <input id="dacq_taste_list" type="hidden" value=${items[t].tastes_kor}>
                        <li id="amount">
                            <div id="p">$ ${items[t].price}</div>
                            <input type='number' value=1 min=0 max='${today_limit.dacq_limit}'/>       
                        </li>
                        <li class="add_button" id="button_${items[t].item_name_kor}">
                            <button type="button" onclick="addCart(this.parentElement)">Add to cart</button>
                        </li>
                        <li class="fix_button" id="fixCart_${items[t].item_name_kor}">
                            <button type="button" onclick="fixCart(this.parentElement)">Added</button>
                        </li>
                    </ul>`;
                    
                    dacq_div += dacq_content;


                    //
                                    
                }
            }
    }

        calendar_section.style.display = 'none';
        alret_modal.style.height = '100vh';

        //item_list.innerHTML = div;
        cake_list.innerHTML = cake_div;
        cake_list.innerHTML += custom_cake_div;
        dacq_list.innerHTML = dacq_div;

        if(order_day == "20201223" || order_day == "20201224" || order_day == "20201225" || order_day == "20201226") {
            document.querySelector('.cake_list').style.gridTemplateColumns = "repeat(1,1fr)";
            document.querySelector('.dacq_list').style.gridTemplateColumns = "repeat(1,1fr)";
            
            let imgList = document.querySelectorAll('#img');
            
            for(var i=0; i<imgList.length; i++) {
                imgList[i].style.width = "50%";
            }

        }
        
        item_section.style.display = 'block';
    });

alret_modal.addEventListener('click', e => {
    alret_modal.style.height = 0;
    menu_modal.style.height = '100vh';
})

function cake__inquiry() {
    var content = `<p id='kor'>해당 케이크는 이메일(bakingbunny.yyc@gmail.com)로 별도 문의 부탁드립니다. 감사합니다 :)</p>`;
    modal_content.innerHTML = content;   
    modal.style.display = "flex";
}

/* menu section*/

//important! global variable of order information
let orderObjectArray = [{
    "type": "null",
    "item_name": "null",
    "amount": 0,
    "price": 0,
    "set_value": 0,
    "taste_set" : "null",
}];

function getSumOrder() {
    
    var sum = 0;

    for(var i =1; i < orderObjectArray.length; i++) {
        sum += (orderObjectArray[i].amount) * (orderObjectArray[i].price) * (orderObjectArray[i].set_value);
    }

    return parseFloat(sum.toFixed(1));
}

const total__check = document.querySelector('.total_check');

//menu select

const modal = document.querySelector(".modal");
const modal_content = document.querySelector(".modal__content");

const size_modal = document.querySelector(".cake_size_modal");
const size_modal_content = document.querySelector(".cake_size_modal_content");

const taste_modal = document.querySelector(".dacq_set_modal");
const taste_modal_content = document.querySelector(".dacq_set_modal_content");

cake_list.addEventListener('click', e => {

    if(e.target.innerHTML == "option select") {
        
        size_modal_content.value = e.target.id;
        let taste_option = "taste_"+e.target.id;

        let taste = document.querySelector(`#cake_taste`);
        let size = document.querySelector('#cake_size_op');
        let cake_taste = document.querySelector(`#${taste_option}`).value;

        size.innerHTML = `<h3>Size</h3><table id="cake_taste_list"><tr>`;
        size.innerHTML += `<td><input type="radio" name="cake_size" value=1></td><td>6 inch</td>`;
        size.innerHTML += `<td><input type="radio" name="cake_size" value=1.2></td><td>8 inch</td>`;
        size.innerHTML += `</tr></table>`;

        taste.innerHTML = "";
        document.querySelector("#cake_message").innerHTML = "";

        if(cake_taste.length > 1) {
            let cake_taste_list = cake_taste.split(",");

            let cake_taste_content = `<h3>Fruits</h3><table id="cake_taste_list">`;
        
            for(var i=0; i<cake_taste_list.length; i++) {
                cake_taste_content += `<tr><td><input type="radio" name="cake_taste_option" value="${cake_taste_list[i]}"></td><td>${cake_taste_list[i]}</td></tr>`;
            }
            
            cake_taste_content += '</table>';
            
            taste.innerHTML = cake_taste_content;
        }

        size_modal.style.height = '100vh';
    }
})

dacq_list.addEventListener('click', e => {

    if(e.target.innerHTML == "taste select") {
        
        let taste_data = document.querySelector("#dacq_taste_list").value;
        let taste_list = taste_data.split(",");
        
        console.log(taste_list);

        let taste_content = `<table id="taste_list">`;

        for(var i=0; i <taste_list.length; i++) {
            taste_content += `<tr id="taste"><td id="taste_td">${taste_list[i]}</td><td id="taste_no"><input class="taste" id="${taste_list[i]}" type=number value=0 min=0/></td></tr>`
        }

        taste_content += "</table>";

        document.querySelector(".taste_info").value = e.target.id;
        document.querySelector("#tastes").innerHTML = taste_content;
        document.querySelector("#taste_message").innerHTML = "";

        taste_modal.style.height = '100vh';
    }
})


function cakeOption(id) {
    
    let taste_option = "taste_"+id;

    let size = document.querySelector("input[name=cake_size]:checked");
    let taste = document.querySelector("input[name=cake_taste_option]:checked");
    let cake_taste = document.querySelector(`#${taste_option}`).value;

    let size_value = "";
    let taste_value = "";

    if(size != undefined && size != null) {
        size_value = size.value;
    }

    if(cake_taste.length > 1) {
        if(taste != undefined && taste != null) {
            taste_value = taste.value;
        }
        else {
            taste_value = 1;
        }
    }


    if(size_value == "") {
        document.querySelector("#cake_message").innerHTML = "사이즈를 선택해 주세요";
    }

    else if(taste_value == 1) {
        document.querySelector("#cake_message").innerHTML = "과일을 선택해 주세요";
    }

    else {

        let value = size_value+" "+taste_value;

        document.querySelector(`#${id}`).value = value;
        size_modal.style.height = 0;

    }
}

function tasteValue(v) {
    let tastes = document.querySelectorAll(`.taste`);
    
    let sum = 0;
    
    let tasteObjectList = [];
    

    for(var t=0; t<tastes.length; t++) {
        sum += parseInt(tastes[t].value);
        
        if(parseInt(tastes[t].value) > 0) {
            let tasteObject = {taste: "", amount: ""};
            tasteObject.taste = tastes[t].id;
            tasteObject.amount = parseInt(tastes[t].value);
            tasteObjectList.push(tasteObject);
        }

    }

    console.log(tasteObjectList);
    

    if(sum == 10) {
        document.querySelector(`#${v}`).value = JSON.stringify(tasteObjectList);
        taste_modal.style.height = 0;
    }

    else {
        document.querySelector("#taste_message").innerHTML = "다쿠아즈 수량은 10개여야합니다";
    }
    
}

function xButton_taste() {
    taste_modal.style.height = 0;
}

function xButton_cake_taste() {
    size_modal.style.height = 0;
}


var cake_total = 0;
var dacq_total = 0;

function addCart(p) {

    const amount_class = p.previousElementSibling;
    const title = amount_class.previousElementSibling.firstElementChild.innerHTML;
    const set_value = amount_class.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild;
    const price_array = (amount_class.firstElementChild.innerHTML).split(' ');
    const price = parseFloat(price_array[1]).toFixed(2);
    const type = p.parentElement;
    const amount = parseInt(amount_class.firstElementChild.nextElementSibling.value);
    
    var content = ""

    if(title == "크리스마스-산타") {
        content = `<p id='kor'>빨강 & 초록 색소를 사용해 색소에 민감하신 분들은 주문에 유의하시기 바랍니다. 생크림 케익 위에 올려진 데코는 버터크림입니다. 소독 세척된 x-mas 피규어가 포함되어 있습니다.</p><p id='kor'>수정을 원하시면 수량을 변경하신 후 Added 버튼을 눌러주세요</p>`;
    }

    else if(title == "크리스마스-트리") {
        content = `<p id='kor'>초록 색소를 사용해 색소에 민감하신 분들은 주문에 유의하시기 바랍니다. 생크림 케익 위에 올려진 데코는 버터크림입니다.</p><p id='kor'>수정을 원하시면 수량을 변경하신 후 Added 버튼을 눌러주세요</p>`;
    }

    else {
        content = `<p id='kor'>추가되었습니다. 다른 메뉴를 더 선택하시거나, 하단의 Next 버튼을 누르시고 다음 단계로 가셔도 됩니다.</p><p id='kor'>수정을 원하시면 수량을 변경하신 후 Added 버튼을 눌러주세요</p>`;
    }

    if(type.id == 'cake') {
        
        cake_total += amount;
        
        if(today_limit.cake_limit == 0) {
            content = `<div id='kor'>죄송합니다, 이 날의 케익은 모두 마감되었습니다.</div>`;
            cake_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(cake_total > today_limit.cake_limit) {
            content = `<div id='kor'>죄송합니다, 이 날 가능한 케익의 수량은 총 ${today_limit.cake_limit} 개 입니다.</div>`;
            cake_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(set_value.value == "none" || set_value.value == undefined) {
            
            content = "<div id='kor'> 케익 옵션을 먼저 선택해 주세요 </div>";
            cake_total -= amount;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
        }

        else{

            let set_option = (set_value.value).split(" ");
            
            var newItem = {
                "type": type.id,
                "item_name": title,
                "amount": amount,
                "price": price,
                "set_value": parseFloat(set_option[0]),
                "taste_set": set_option[1]                
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

    /**
    else if(type.id == 'custom-cake') {
        cake_total += amount;
        
        content = 
        `<p>Succesfully added, but this is not the final confirmation. I'll ask you further question to set design and favor after you finished to check out.</p>`+
        `<p>You can add other items more, otherwise click the next button below.</p><p>if you want to change the amount, change it and click the Added button.</p>`;

        if(cake_total > today_limit.cake_limit) {
            content = `Sorry, You cannot put cake more than ${today_limit.cake_limit}`;
            cake_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(cake_set.value == "none" || cake_set.value == undefined) {
            
            content = "Please select the cake size first";
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
     */

    else if(type.id == 'dacquoise') {
        dacq_total += amount;

        if(today_limit.dacq_limit == 0) {
            content = `<div id='kor'>죄송합니다, 이 날의 다쿠아즈는 모두 마감되었습니다.</div>`;
            dacq_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(dacq_total > today_limit.dacq_limit) {
            content = `<div id='kor'>죄송합니다, 이 날 가능한 다쿠아즈의 수량은 총 ${today_limit.dacq_limit} 개 입니다.</div>`;
            dacq_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else{
            var newItem = {
                "type": type.id,
                "item_name": title,
                "amount": amount,
                "price": price,
                "set_value": 1
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

    else if(type.id == 'dacquoise-set') {
        dacq_total += amount;

        if(today_limit.dacq_limit == 0) {
            content = `<div id='kor'>죄송합니다, 이 날의 다쿠아즈는 모두 마감되었습니다.</div>`;
            dacq_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(dacq_total > today_limit.dacq_limit) {
            content = `<div id='kor'>죄송합니다, 이 날 가능한 다쿠아즈의 수량은 총 ${today_limit.dacq_limit} 개 입니다.</div>`;
            dacq_total -= amount;
            amount_class.firstElementChild.nextElementSibling.value = 1;
        }

        else if(set_value.value == "none" || set_value.value == undefined) {
            
            content = "<div id='kor'> 테이스트를 먼저 선택해 주세요 </div>";
            cake_total -= amount;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
        }

        else{
            var newItem = {
                "type": type.id,
                "item_name": title,
                "amount": amount,
                "price": price,
                "set_value": 1,
                "taste_set": set_value.value                
            }
            
            orderObjectArray.push(newItem); 

            console.log(orderObjectArray);

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
    const set_value = amount_class.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild;
    const type = p.parentElement;
    const amount = parseInt(amount_class.firstElementChild.nextElementSibling.value);

    var content = "<div id='kor'> 수정되었습니다.</div>";

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
                        let set_option = (set_value.value).split(" ");

                        orderObjectArray[i].amount = amount;
                        orderObjectArray[i].set_value = parseFloat(set_option[0]);
                        orderObjectArray[i].taste_set = set_option[1];
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

    else if(type.id == 'dacquoise-set') {
        
        var check = false;
        var  i = 1;

        while(!check) {
            if(orderObjectArray[i].item_name === title) {
                var difference = amount - orderObjectArray[i].amount;
                
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
                    orderObjectArray[i].taste_set = set_value.value;
                    amount_class.firstElementChild.innerHTML = "$ "+ (orderObjectArray[i].amount * orderObjectArray[i].price).toFixed(1);
                    
                    console.log(orderObjectArray);

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

const next_customer_button = document.querySelector('#next_customer');
const customer_section = document.querySelector('.third');
const cake_lettering = document.querySelector('.cake_lettering');

const pickup_button = document.querySelector('#pick');
const delivery_button = document.querySelector('#delivery');

const delivery_option_info = document.querySelector('.delivery_option_info');

const pickup_info = document.querySelector('.pickup_info');
const pickup_location = document.querySelector('.pickup_location');
const pickup_address = document.querySelector('.pickup_address');
const pickup_selection = document.querySelector('.pickup_selection');

const delivery_info = document.querySelector('.delivery_info');

var customer_info = {
    "name": "",
    "etransfer":"",
    "insta": "",
    "phone": "",
    "allergy": "",
    "delivery": "",
    "pickup_time": "",
    "delivery_fee": "",
    "postal_code": "",
    "address":"",
    "lettering": [],
    "lettering_id": [],
    "etc": ""
}

next_customer_button.addEventListener('click', e => {
    
    var sumOrder = getSumOrder();

    if(sumOrder == null || sumOrder == '' || sumOrder == 0) {
    
        var content = "<div id='kor'>메뉴를 선택해주세요</div>"
        modal_content.innerHTML = content;   
        modal.style.display = "flex";
    }

    else {
    
    customer_info.lettering_id = [];

    if (sumOrder < 50) {
        delivery_button.checked = false;
        delivery_info.style.display = "none";
    }

    //christmas
    if(order_day != "20201223" && order_day != "20201224" && order_day != "20201225" && order_day != "20201226") { 
    
    for(var i=1; i<orderObjectArray.length; i++) {
        
        if(orderObjectArray[i].type == 'cake' && orderObjectArray[i].amount != 0) {

        var lettering_q = document.createElement("li");
        lettering_q.classList.add("question");
        var markup = `<label for='lettering_${i}'> Messages on ${orderObjectArray[i].item_name} (optional)`;
        lettering_q.innerHTML = markup;
        cake_lettering.appendChild(lettering_q);

        var lettering_a = document.createElement("li");
        lettering_a.classList.add("answer");
        var markup_2 = `<input type="text" id="${orderObjectArray[i].item_name}_${i}" name="lettering_${i}" maxlength="30">`;
        lettering_a.innerHTML = markup_2;
        cake_lettering.appendChild(lettering_a);

        customer_info.lettering_id.push(`${orderObjectArray[i].item_name}_${i}`);
        
            if(orderObjectArray[i].amount > 1) {

                for(var l=1; l<orderObjectArray[i].amount; l++) {

                var lettering_q = document.createElement("li");
                lettering_q.classList.add("question");
                var markup = `<label for='lettering_${i}_${l}'> Messages on ${orderObjectArray[i].item_name} ${l+1} (optional)`;
                lettering_q.innerHTML = markup;
                cake_lettering.appendChild(lettering_q);

                var lettering_a = document.createElement("li");
                lettering_a.classList.add("answer");
                var markup_2 = `<input type="text" id="${orderObjectArray[i].item_name}_${i}_${l}" name="lettering_${i}_${l}" maxlength="30">`;
                lettering_a.innerHTML = markup_2;
                cake_lettering.appendChild(lettering_a);

                customer_info.lettering_id.push(`${orderObjectArray[i].item_name}_${i}_${l}`);
                }
            }
        }
    }
    } //christmas
        item_section.style.display = 'none';
        customer_section.style.display = 'block';   
    }
})

var customer_delivery_fee = null;

const delivery_option_modal = document.querySelector('.delivery_option_modal');
const delivery_option_content = document.querySelector('.delivery_option_content');


function xButton() {
    delivery_option_modal.style.height = 0;
}

pickup_button.addEventListener('click', e => {
    
    customer_info.postal_code = '';
    customer_info.address = '';

    delivery_info.style.display = "none";
    pickup_info.style.display = 'block'; 
    
    customer_delivery_fee = 0;

    let map = new google.maps.Map(pickup_location, {
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
    
    var markup = "<p>Pick-up location</p>";
    pickup_address.innerHTML = markup;    
    
    markup = 
    `<select name="pickup_time" id="pickup_time">
    <option value="" selected="selected">Choose a pick-up time</option>`
    
    for(var l=0; l < (today_limit.pickup_time.length); l++) {
        
        var pick_time = today_limit.pickup_time[l].timeline;
        var pick_text = ""

        pick_text = pick_time +":00 - "+ pick_time +":59"; 
        
        if(today_limit.pickup_time[l].limit == 0) {
            markup+=`<option value=${pick_time} disabled>${pick_text} (sold out)</option>`;    
        }

        else {
        markup+=`<option value=${pick_time}>${pick_text}</option>`;
        }
    }
    
    markup += `</select>`;    
    
    pickup_selection.innerHTML = markup;    
    
    delivery_option_modal.style.height = '100vh';
   
})

function pickup_apply() {
    var selected_time = document.querySelector('#pickup_time');
    var specific_time = document.querySelector('#specific_pick');

    if(selected_time.value == "") {

        document.querySelector('.pickup_err').innerHTML = "<div id='kor'>시간 대를 먼저 선택해주세요</div>"
    }

    else if(specific_time.value == "") {

        document.querySelector('.pickup_err').innerHTML = "<div id='kor'>몇분에 오실지 적어주세요</div>"
    }

    else if(specific_time.value > 59 || specific_time.value < 0) {

        document.querySelector('.pickup_err').innerHTML = "<div id='kor'>잘못된 숫자를 적으셨습니다</div>"
    }

    else {
        document.querySelector('.pickup_err').innerHTML = "";
        delivery_option_modal.style.height = '0vh';
        
        delivery_option_info.innerHTML=
        `<p>Pickup Service at ${selected_time.value}:${specific_time.value}</p>`;
        
        customer_info.pickup_time = selected_time.value+":"+specific_time.value;
    }
}

delivery_button.addEventListener('click', e => {
    
    customer_info.pickup_time = 0;
    delivery_info.style.display = "block";
    pickup_info.style.display = 'none'; 
    
    var order_sum = getSumOrder();

    if(order_sum > 49.99) {

        if(order_day == "20201225" ||order_day == "20201226") {
            var content = "<div id='kor'> 죄송합니다. 이 날은 딜리버리 서비스가 불가능합니다.</div>";
            delivery_button.checked = false;
            modal_content.innerHTML = content;   
            modal.style.display = "flex";
        }
        
        else if(order_day_num == 5 || order_day_num == 6) {
                delivery_info.style.display = "block";
                delivery_option_modal.style.height = '100vh';
        }

        else {
            var content = "<div id='kor'> 죄송합니다. 딜리버리는 금요일에서 토요일까지만 가능합니다.</div>";
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


function delivery_apply() {
    
    var specific_address = document.querySelector('#specific_address'); 
    
    if(customer_delivery_fee == null || specific_address.value == undefined) {        

        document.querySelector('.delivery_err').innerHTML = "<div id='kor'> 우편 번호 확인을 먼저 부탁드려요</div>";
    }

    else if(specific_address.value == "") {
        document.querySelector('.delivery_err').innerHTML = "<div id='kor'> 상세 주소를 적어주셔야해요</div>";
    }

    else {
        document.querySelector('.delivery_err').innerHTML = "";

        var mark = '';

        if(customer_delivery_fee == 0) {
            mark = "<p>Free Delivery Service</p>";
        }

        else {
            mark = `<p>$${customer_delivery_fee} Additional Delivery Fee</p>`;
        }

        delivery_option_info.innerHTML= mark;
        
        customer_info.postal_code = document.querySelector('#postal').value;
        customer_info.address = specific_address.value;
        delivery_option_modal.style.height = '0vh';        
    }
}


const address_check = document.querySelector('#address_check');
const post_code = document.querySelector('#postal');
const delivery_fee = document.querySelector('#delivery_fee');
const delivery_specific = document.querySelector('#delivery_specific');

var address_check_validation = true;

post_code.addEventListener('focus', e=> {
    address_check_validation = false;
});

address_check.addEventListener('click', e=> {
    e.preventDefault;

    address_check_validation = true;

    delivery_fee.style.display = 'none';    
    delivery_specific.style.display = 'none';

    var code = post_code.value;

        var service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [code],//[new google.maps.LatLng(office.lati, office.long)],
            destinations: ["T2P 3P3"],//[new google.maps.LatLng(lati, long)],
            travelMode: google.maps.TravelMode.DRIVING,
        }, function(response, status){
            
            var content = '';
            
            if(response.rows[0].elements[0].distance == undefined || response.rows[0].elements[0].status == "NOT_FOUND") {
                
                    delivery_fee.innerHTML = "<p id='kor'>구글맵에서 확인되는 정확한 우편 번호를 적어주세요</p>";
                    post_code.value = null;
                    delivery_fee.style.display = 'block';                    
                    customer_delivery_fee = null;
            }

            else {

                var distance = response.rows[0].elements[0].distance.value;

                if(distance < 5000) {
                    delivery_fee.innerHTML = "<p>Free Delivery Service</p>";
                    delivery_fee.style.display = 'block';
                    delivery_specific.style.display = 'block';
                    customer_delivery_fee = 0;
                }

                else if(distance < 10000) {
                    delivery_fee.innerHTML = "<p> $3 additional delivery fee</p>" ;
                    delivery_fee.style.display = 'block';
                    delivery_specific.style.display = 'block';
                    customer_delivery_fee = 3;
                }

                else if(distance < 15000) {
                    delivery_fee.innerHTML = "<p> $5 additional delivery fee</p>";
                    delivery_fee.style.display = 'block';
                    delivery_specific.style.display = 'block';
                    customer_delivery_fee = 5;
                }

                else if(distance < 20000) {
                    delivery_fee.innerHTML = "<p> $7 additional delivery fee</p>";
                    delivery_fee.style.display = 'block';
                    delivery_specific.style.display = 'block';
                    customer_delivery_fee = 7;
                }

                else if(distance < 25000) {
                    delivery_fee.innerHTML = "<p> $10 additional delivery fee </p>";
                    delivery_fee.style.display = 'block';
                    delivery_specific.style.display = 'block';
                    customer_delivery_fee = 10;
                }

                else {
                    content = "<div id='kor'> 죄송합니다. 이 지역은 딜리버리가 불가능합니다.</div>";
                    post_code.value = null;
                    modal_content.innerHTML = content;   
                    modal.style.display = "flex";
                    customer_delivery_fee = null;
                }
            }
        }
        );
     });

const prev_items_button = document.querySelector('#prev__items');

prev_items_button.addEventListener('click', e => {
    
    while(cake_lettering.hasChildNodes()) {
        cake_lettering.removeChild(cake_lettering.firstChild);
    }

    customer_section.style.display = 'none';
    item_section.style.display = "block";
})

const next_check_button = document.querySelector('#next_check');

const confirmation_section = document.querySelector('.fourth');

next_check_button.addEventListener('click', e =>{

    var name = document.querySelector('#cust_name').value;
    var etransfer = document.querySelector('#etrans_name').value;
    var insta = document.querySelector('#insta').value;
    var phone = document.querySelector('#phone').value;
    var allergy = document.querySelector('#allergy').value;
    var etc = document.querySelector('#etc').value;
    var delivery = '';
    
    var error_check = {
        check: false,
        message: ''        
    }

    if(pickup_button.checked == true) {
        delivery = 'pickup';

        if(customer_info.pickup_time == 0) {
            error_check.check = true;
            error_check.message = "<div id='kor'>픽업 메뉴에서 시간대를 선택해주세요</div>";
        }
    }

    else if(delivery_button.checked == true) {

        if(post_code.value != null && post_code.value != '') {
            delivery = 'delivery';
            
            if(!address_check_validation) {
                error_check.check = true;
                error_check.message = "<div id='kor'>딜리버리 메뉴에서 Check Address 버튼을 꼭 눌러주세요</div>";
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

    if(name == null || phone == null || name == '' || phone == '' || name == 0 || phone == 0 ||
        insta == null || insta == '' || allergy == null || allergy == '' || etransfer == null 
        || etransfer == '') {
        error_check.check = true;
        error_check.message = "<div id='kor'>other inquiries와 lettering을 제외한 모든 내용을 적어주셔야 합니다.</div>";        
    }

    if(error_check.check == false) {

        customer_info.name = name;
        customer_info.etransfer = etransfer;
        customer_info.insta = insta;
        customer_info.phone = phone;
        customer_info.allergy = allergy;
        customer_info.delivery = delivery;
        customer_info.delivery_fee = customer_delivery_fee;
        customer_info.etc = etc;

        var lettering_array = [];

        //christmas
        if(order_day != "20201223" && order_day != "20201224" && order_day != "20201225" && order_day != "20201226") {

        for(var t=0; t<(customer_info.lettering_id).length; t++) {

            lettering_array.push(document.querySelector(`#${customer_info.lettering_id[t]}`).value);
        }
    }

        customer_info.lettering = lettering_array;

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

    var order_schedule = order_day + " "+ day_list[order_day_num - 1];

    var cust_info = 
    `<tr><td id="head">Schedule</td><td id="content"><input type="text" name="schedule" value="${order_schedule}" readonly/></td>`+
    `<tr><td id="head">Name</td><td id="content"><input type="text" name="name" value="${cust.name}" readonly/></td>`+
    `<tr><td id="head">Insta ID / Email</td><td id="content"><input type="text" name="insta" value="${cust.insta}" readonly/></td>`+
    `<tr><td id="head">Phone Number</td><td id="content"><input type="text" name="phone" value="${cust.phone}" readonly/></td>`+
    `<tr><td id="head">Allergy</td><td id="content"><input type="text" name="allergy" value="${cust.allergy}" readonly/></td>`;
    
    if(cust.delivery == 'delivery') {
        cust_info += `<tr><td id="head">Delivery Option</td><td id="content"><input type="text" name="deliveryOption" value="${cust.delivery}" readonly/></td>`+
        `<tr><td id="head">Address</td><td id="content"><input type="text" name="address" value="${cust.address}" readonly/></td>`;
    }

    else {
        cust_info += `<tr><td id="head">Delivery Option</td><td id="content"><input type="text" name="deliveryOption" value="${cust.delivery} at ${cust.pickup_time}" readonly/></td>`;
    }

    customer_table.innerHTML = cust_info;

    var order_info = "<tr><td id='head'>Product</td><td id='head'>Qty</td><td id='head'>Price</td>";
    var l=0;

    for(var i =1; i<ord.length; i++) {

        if(ord[i].amount > 0) {
        
        let size = '';
        var div = '';

        if(cake_name_list.includes(ord[i].item_name)) {

        if(ord[i].set_value == 1) {
            size = ' 6 inch';
        }

        else if(ord[i].set_value == 1.2) {
            size = ' 8 inch';
        }

        div = `<tr><td id="item"><input type="text" name="item_name_${i}" value="${ord[i].item_name}${size} ${ord[i].taste_set}" style="font-size:12px;" readonly/></td><td id="amount"><input type="text" name="amount_${i}" value="${ord[i].amount}" readonly/></td><td id="price"><input type="text" name="price_${i}" value="${(ord[i].price*ord[i].amount*ord[i].set_value).toFixed(1)}" readonly/></td>`;
        
         //christmas
         if(order_day != "20201223" && order_day != "20201224" && order_day != "20201225" && order_day != "20201226") {

        for(var t=0; t<ord[i].amount; t++) {
        
            div +=`<tr><td id="item" colspan=3><input type="text" name="lettering_${l}" value="lettering: ${cust.lettering[l]}" style="font-size:12px;" readonly/>`;        
            l++;
            }
        } }

        else {

            if(ord[i].type == "dacquoise-set") {
                div = 
                `<tr><td id="item"><input type="text" name="item_name_${i}" value="${ord[i].item_name}" style="font-size:12px;" readonly/></td><td id="amount"><input type="text" name="amount_${i}" value="${ord[i].amount}" readonly/></td><td id="price"><input type="text" name="price_${i}" value="${(ord[i].price*ord[i].amount*ord[i].set_value).toFixed(1)}" readonly/></td>`;
                
                let setList = JSON.parse(ord[i].taste_set);
                let divCon = `<tr><td id="item" colspan=3><input type="text" name="taste_set" value="`
                
                for(var o=0; o <setList.length; o++) {
                    divCon+= `${setList[o].taste}(${setList[o].amount}) `;
                }

                divCon += `x${ord[i].amount}" style="font-size:12px;" readonly/></td></tr>`;

                div += divCon;
            }      
            else {
                div = 
                `<tr><td id="item"><input type="text" name="item_name_${i}" value="${ord[i].item_name}" style="font-size:12px;" readonly/></td><td id="amount"><input type="text" name="amount_${i}" value="${ord[i].amount}" readonly/></td><td id="price"><input type="text" name="price_${i}" value="${(ord[i].price*ord[i].amount*ord[i].set_value).toFixed(1)}" readonly/></td>`;     
            }
        }
        

        order_info += div;
        }
    }

    var total_sum = getSumOrder();

    if(deliv > 0) {
        order_info +=
        `<tr><td id="head" colspan=2>Delivery Fee</td><td id="price"><input type="text" name="delivery_fee" value="${deliv}" readonly/></td>`;

        total_sum += parseInt(deliv);
    }

    order_info += `<tr><td id="head" colspan=2>Total($)</td><td id="price"><input type="text" name="total_sum" value="${total_sum}" readonly/></td>`;

    
    var obj_ord = JSON.stringify(ord);
    var obj_cust = JSON.stringify(cust);
    
    order_info += `<input type="text" name="ord_obj" value='${obj_ord}' style="display:none;"/>`;
    order_info += `<input type="hidden" name="cust_obj" value='${obj_cust}'/></tr>`;
    
    order_table.innerHTML = order_info;
    
    

    //sessiong storage

}

const request_button = document.querySelector('#next_request');
const request_modal = document.querySelector('.request_modal');

request_button.addEventListener('click', e=> {
    request_modal.style.height = "100%";

});

prev_custom_button.addEventListener('click', e=> {
    
    confirmation_section.style.display = 'none';
    customer_section.style.display = 'block';
});



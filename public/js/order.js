var today = new Date();
var nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);

var today__num = today.getDay();

var fullDate = nextWeek.toISOString().slice(0,10);
var date = fullDate.split('-');

const availalbeDate = date[1]+date[2];

const calendar = document.querySelector('.calendar');

const schedule__date = document.querySelectorAll('.date');

console.log(schedule__date[0].id);

console.log(availalbeDate);

window.onload=updateSchedule;

let dac__blue = {
    image: '/img/blue.jpg',
    desc: 'blah blah'
}

let dac__injeol = {
    image: '/img/injeol.jpg',
    desc: 'blah blah'
}


function updateSchedule() {
    for(var i = 0; i < schedule__date.length; i++ ) {
        
        if(today__num == 7) {
        
            if(schedule__date[i].id < availalbeDate) {
                schedule__date[i].style.background = 'black';
                schedule__date[i].setAttribute('disabled', 'disabled');
            }

        }

        if( parseInt((schedule__date[i].id).substr(0,2)) == 1 + parseInt(availalbeDate.substr(0,2))) {
            schedule__date[i].style.background = 'orange';
            //schedule__date[i].setAttribute('disabled', 'disabled');
        }

        if( parseInt((schedule__date[i].id).substr(0,2)) == 2 + parseInt(availalbeDate.substr(0,2))) {
            schedule__date[i].style.background = 'red';
            schedule__date[i].setAttribute('disabled', 'disabled');
        }

    }
}

const baking__data = document.querySelector('.data').value;

const calendar_section = document.querySelector('.first');

const item_section = document.querySelector('.second');

const item_list = document.querySelector('.second .item__list');
const item_list_next = document.querySelector('.second .next_button');

calendar.addEventListener('click', e => {
    const targetWork = e.target.closest('button');

    console.log(targetWork);

    var jsonData = JSON.parse(baking__data);

    console.log(jsonData);
    var ourData;
    for(var i=0; i <jsonData.length; i++) {
        if(jsonData[i].date == targetWork.id){
            ourData = jsonData[i];
        }
    }
    
    var dataList = Object.values(ourData);
    
    var div = '';
    
    for(var i=1; i<dataList.length; i++) {
        
        var content = '';
        
        if((dataList[i])[1] != 0) {
                
            content = 
            `<ul class="item">
                <li id="image">
                    <img src="img/blue.jpg"/>
                </li>
                <li id="name">${(dataList[i])[0]}</li>
                <li id="amount">
                    <input type='number' limit=${(dataList[i])[1]}/>       
                </li>
                <li id="button">
                    <button type="button" onclick="myFunction(this.parentElement)">Add to cart</button>
                </li>
            </ul>`;    
            }
        
        else {

            content = 
            `<ul class="item">
                <li id="image">
                    <img src="img/inejol.jpg"/>
                </li>
                <li id="name">${(dataList[i])[0]}</li>
                <li id="amount">
                    <input type='number' limit=${(dataList[i])[1]}/>       
                </li>
                <li id="button">
                    Sold Out
                </li>
            </ul>`;    
            }
        div += content;
        }

        calendar_section.style.display = 'none';

        item_list.innerHTML = div;
        item_list_next.innerHTML =  "<button>previous</button><button>next</button>"

        item_section.style.display = 'block';
    });

let orderObject = [{
    item_name: '',
    amount: '',
    price: '',
}];

//when click 



const modal = document.querySelector(".modal");

function myFunction(p) {

    console.log(p);
    const amount = p.previousElementSibling;
    const title = amount.previousElementSibling.innerHTML;
    console.log((amount.firstElementChild).value);
    console.log(title);

    modal.style.display = "flex";
    
    //need message successfully added
    //you can add more desert or click the next button

    //add order info to orderObject
    
}

window.onclick = function(e) {
    if(e.target == modal) {
    modal.style.display = "none";
    }
  }
  
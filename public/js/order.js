var today = new Date();
var nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+31);

var fullDate = nextWeek.toISOString().slice(0,10);
var date = fullDate.split('-');

const availalbeDate = date[1]+date[2];

const calendar = document.querySelector('.calendar');

const schedule__date = document.querySelectorAll('.date');

console.log(schedule__date[0].id);

console.log(availalbeDate);

window.onload=updateSchedule;

function updateSchedule() {
    for(var i = 0; i < schedule__date.length; i++ ) {
        if(schedule__date[i].id < availalbeDate) {
            schedule__date[i].style.background = 'black';
            schedule__date[i].setAttribute('disabled', 'disabled');
        }
    }
}

const baking__data = document.querySelector('.data').value;

const item_list = document.querySelector('.second');

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
            content = (dataList[i])[0] + `<input type='number' limit=${(dataList[i])[1]}><br>`;
        }

        div += content;
    }

    item_list.innerHTML = div;

})



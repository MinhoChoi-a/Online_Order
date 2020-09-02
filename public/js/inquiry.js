jQuery(document).ready(function($){
  
    $("form").submit(function(e) {
          
      e.preventDefault();
        
      var formData = $(this).serialize();
      
      console.log(formData);
        
        $('form.contact_form').css("display", "none");    
      
        $('.loading').css("display", "flex");

        $.post('/email', formData, function (data) {
          
            $('.text_content').html(data);
            $('.loading').css("display", "none");
            $('.sent').css("display", "flex");
            $('button.send').css("display", "none");
          
          }); 
          
        })
    });

const inquiry__button = document.querySelector('.inquiry');
const inquiry__modal = document.querySelector('.inquiry_modal');
const close__button_one = document.querySelector('button.close_one');
const close__button_two = document.querySelector('button.close_two');

inquiry__button.addEventListener('click', e => {
    inquiry__modal.style.height = '100vh';
})

close__button_one.addEventListener('click', e=>{
    inquiry__modal.style.height = 0;
})

close__button_two.addEventListener('click', e=>{
    inquiry__modal.style.height = 0;
})

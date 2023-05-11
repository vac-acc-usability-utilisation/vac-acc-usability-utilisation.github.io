//toggle menu
$( document ).ready(function() {
    //click menu btn
    $('#mva-nav-btn').click(function() {
        var expanded = $(this).attr("aria-expanded")
        if (expanded == "true") {
            $(this).attr("aria-expanded", "false");
        }
        else if (expanded == "false") {
            $(this).attr("aria-expanded", "true");
            // set focus to first child
            $(this).siblings('ul').find("li:first > a").focus();
        }
    });
    // if menu is expanded by default, but page is loaded on a mobile device, close the menu by default instead
    if  ($('#mva-nav-btn').attr("aria-expanded")) {
        if (window.matchMedia('(max-width: 991px)').matches) 
        {
            // for overview page, if 
            $('#mva-nav-btn').attr("aria-expanded", false)
        }

       
    }

     //hide is user presses ESC key
     $(document).keyup(function(e) {
        if ((e.key === "Escape") && ($('#mva-nav-btn').attr("aria-expanded"))) { // escape key maps to keycode `27`
           $('#mva-nav-btn').attr("aria-expanded", "false");
       }
   });


   
    
});

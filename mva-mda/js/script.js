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

   if (location.pathname == "/demo/en/index.html") {

    if  ($('#mva-nav-btn').attr("aria-expanded")) {
        if (window.matchMedia('(max-width: 991px)').matches) 
            {
                // for overview page, if page is mobile, collapse menu 
                $('#mva-nav-btn').attr("aria-expanded", false);
                $('#mva-nav-btn').attr("disabled", false);
            }       
        }

        if (window.matchMedia('(min-width: 991px)').matches) {
            $('#mva-nav-btn').attr("aria-expanded", true);
            $('#mva-nav-btn').attr("disabled", true);
        }

        window.matchMedia("(max-width:991px)").onchange = (e) => {
            if (e.matches) {
              /* the viewport is 600 pixels wide or less */
              $('#mva-nav-btn').attr("aria-expanded", false);
                $('#mva-nav-btn').attr("disabled", false);
            } else {
              /* the viewport is more than 600 pixels wide */
              $('#mva-nav-btn').attr("aria-expanded", true);
            $('#mva-nav-btn').attr("disabled", true);
            }
          };
   }

 
   
    
});



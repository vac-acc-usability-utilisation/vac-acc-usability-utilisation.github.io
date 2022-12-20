    /*⠀⠀honour roll 
    Replaces an inline spinner with 
    a random first and last name 
    of a Veteran from the Honour Roll .api 
    https://open.canada.ca/data/en/dataset/792bb73a-f758-4459-b7e9-0c286a0bc15d
    HTML
    <code>
        
      +++++++++++++++++*/
    
       $.ajax({
         url:"https://www.veterans.gc.ca/xml/jsonp/app.cfc?method=remoteGetHonourRoll&callback=?&language=en",
         
         success:function(dataset){
                //json is as a JSON string, so I trimmed it and parsed with jQuery to json 
                var dataset = dataset.substring(2, dataset.length - 1);
                var json = jQuery.parseJSON(dataset);
                var names = json['days'];   
                var rndHonourRoll = names[Math.floor(Math.random() * names.length)];
                var surname = rndHonourRoll['SURNAME'];
                var firstName = rndHonourRoll['FORENAMES'].replace(/ .*/,'');
                var displayName = firstName + " " + surname;
                writeDisplayName(displayName);
                return;
            },
            error:function(xhr, status){
                console.log("Honour Roll ajax error" + xhr.statusText);
                writeDisplayName("John Doe");
            }      
        });
    
        function writeDisplayName(displayName) {
                   $('.honour').text(displayName);
               }
 

        $( document ).on( "wb-ready.wb", function( event ) {
            $( "#bottom-bar" ).trigger( "open.wb-overlay" );
        });
 
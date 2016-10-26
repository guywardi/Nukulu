// This variable stores the active value of the product id
// Active is the one we are dealing with at the moment (creating/editing)
var item_id;

// Main object, containing the core logic of the application
var app = {};

// An object method, which can get/send data from/to database depending on the query sent
// Takes the value from the search bar or the barcode scanner
app.getSendData = function(id) {

    // The submission form is completely reset
    $('#submit-form')[0].reset();
    $('label[for=shoot_save] p').html("TAKE A PICTURE");

    // Every time the object is called, the active value is changed
    item_id = id;
    // The "readonly" ID field of the submit(create/edit) form always stores the active value
    $('#edit-barcode-code').val(item_id);

    // AJAX request is sent
    $.ajax({
        type: 'GET',
        cache: false,
        url: 'php/get.php',
        data: {
            // Only one parameter is sent
            'id': id
        },
        // Callback function
        success: function(data) {
            if(data.empty == 1) {
                // If there is nothing found, we are allowed to create a new product
                app.CreateObject(id);
            } else {
                // Otherwise we get the data in JSON format and it is get processed by app.ViewObject method
                app.ViewObject(data);
            }
        }
    });

}

// So, after we send AJAX request and get a positive response, meaning that the product exists, this method is called
app.ViewObject = function(json) {

    // Create a div
	var div = $("<div id='base'></div>");

    // Iteration through JSON
	$.each( json, function(i, item) {
		if (item.id){

            // In case, if the user wants to edit the information about the product
            // Not done on "Edit" click to make the values saved during jumping from one page to another
			$('#name').val(item.name);
			$('#origin').val(item.origin);
			$('#description').val(item.description);

            // Creating the table, containing the details about the item
			div.append("<h1 class='name error'>" + item.name + "</h1><div class='img-cont'><img src='" + item.img + "' id='image'></div><table data-role='table' id='phone-table' data-mode='columntoggle' class='phone-compare table-stroke'><tbody><tr><th class='label'>ID</th><td>" + item_id + "</td></tr><tr><th class='label'>Name</th><td>" + item.name + "</td></tr><tr><th class='label'>Origin</th><td>" + item.origin + "</td></tr><tr><th class='label'>Description</th><td>" + item.description + "</td></tr></tbody></table>");

            // Creating an "Edit" button
			div.append("<div class='text-center'><a href='#to_edeate' id='edeat' class='button button-3d button-primary button-rounded edeat' data-transition='slideup'>EDIT THE PRODUCT</a></div>");
            // This class animates the div as if it was "bounced" to the left
			div.addClass("animated bounceInLeft");
		}

        // The previous <div id="base"> is "bounced" to the right, simulating
		$('#base').addClass('animated bounceOutRight');
        // After the 400ms the previous container is emptied and replaced by a new table
        // Such a delay allows us to create a smooth animation of changing the product
		$('#view').delay(400).queue(function(next) {
			$(this).html('');
		    $(this).append(div);
			next();
		});
	})

};

// As it was mentioned previously, if we find nothing in the database, we can create our own product
// The logic here is actually almost the same as in app.ViewObject method
app.CreateObject = function(id) {

	var div = $("<div id='base'></div>");

	div.append("<h1 class='name'>The product <br/> #" + id + " <br/>does not exist in database!</h1>")
	   .append("<div class='text-center'><a href='#to_edeate' class='button button-3d button-primary button-rounded edeat' data-transition='slideup'>CREATE THE PRODUCT</a></div>");
	div.addClass("animated bounceInRight");

	$('#base').addClass('animated bounceOutLeft');

	$('#view').delay(400).queue(function (next) {
		$(this).html('');
	    $(this).append(div);
		next();
	});

}

$( document ).ready(function() {

    var form = $('#submit-form');
    var search = $("input#search-1");

    // When the search button is clicked app.getSendData method with the searched parameter is triggered
    $("#search-1-btn").on("click", function() {
        // Only if the search bar is not empty and its value is other that an active one
        if(search.val() != item_id && search.val() != '') {
            app.getSendData(search.val());
        }
    });

    // When the Back button (blue button on the top of create/edit page) the animation of the object are removed
    // It is done to prevent the excessive animation when the user is jumping from one page to another
    $("a#back").click(function() {
        $('#base').removeClass("animated bounceInLeft bounceInRight");
    });

    // This event listens to teh value change of file input
    // When the photo is taken (image uploaded) it is stated "Saved!"
    form.on('change','#shoot_save' , function() {
        $('label[for=shoot_save] p').html("Saved!");
    });


    // Anchor acts like the form submit button
    $("#send").click(function() {
        // The same trick with the class as previously
        $('#base').removeClass("animated bounceInLeft bounceInRight");

        form.submit();
        return false;
    });

    // This is what we have after
    // To trigger this AJAX request completely we had to use jQuery Form Plugin from http://malsup.com/jquery/form/
    // The traditional data controlling way provided no effect, but bugs which we could not eliminate
    // The thing is that the form (create/edit) contains not only text inputs, but also a file input, the image from which we then send to PHP file
    // There the image is processed and uploaded to Windows Azure Storage Blob
    form.ajaxForm(function() {
        function go() {
            // After the submission the user is redirected to the first page
            $.mobile.changePage("#to_choose", {
                transition: "slideup"
            });

            // The object is refreshed and a new information is shown
            app.getSendData(item_id);
        }
        // But before that there is a 500ms delay, approximately needed for the database to be updated and to animate correctly
        setTimeout(go, 500);
    });

});
// A global variable which defined which image input to implement
var takePicture;

// We made it so the plugin acts differently on each page

// When we are on the first page the plugin reacts on a camera input
$(document).on("pageshow","#to_choose", function(){

    // The image input is assigned
	takePicture = document.querySelector("#shoot");

	var showPicture = document.createElement("img");
			Result = document.querySelector("#error_scan");
			var canvas = document.getElementById("barcode_image");
			var ctx = canvas.getContext("2d");
			JOB.Init();
			JOB.SetImageCallback(function(result) {
				if(result.length > 0){
					var tempArray = [];
					for(var i = 0; i < result.length; i++) {
						tempArray.push(result[i].Value);
					}

                    // Scanned ID
					var id = tempArray.join();

                    // If the page is main
					if($.mobile.path.get() == "" || $.mobile.path.get() == "to_choose") {
						// If the new ID is not equal to active id
                        if(id != item_id){
                            // Change the value of the search input
                            $("input#search-1").val(id);
                            // Trigger the app.getSendData function (js/main.js)
                            app.getSendData(id);
                        }
					}

				} else {
					if(result.length === 0) {
						Result.innerHTML="Decoding failed.";
					}
				}
			});
			JOB.PostOrientation = true;
			JOB.OrientationCallback = function(result) {
				canvas.width = result.width;
				canvas.height = result.height;
				var data = ctx.getImageData(0,0,canvas.width,canvas.height);
				for(var i = 0; i < data.data.length; i++) {
					data.data[i] = result.data[i];
				}
				ctx.putImageData(data,0,0);
			};
			JOB.SwitchLocalizationFeedback(true);
			JOB.SetLocalizationCallback(function(result) {
				ctx.beginPath();
				ctx.lineWIdth = "2";
				ctx.strokeStyle="red";
				for(var i = 0; i < result.length; i++) {
					ctx.rect(result[i].x,result[i].y,result[i].width,result[i].height); 
				}
				ctx.stroke();
			});
			if(takePicture && showPicture) {
				takePicture.onchange = function (event) {
					var files = event.target.files;
					if (files && files.length > 0) {
						file = files[0];
						try {
							var URL = window.URL || window.webkitURL;
							showPicture.onload = function(event) {
								Result.innerHTML="";
								JOB.DecodeImage(showPicture);
								URL.revokeObjectURL(showPicture.src);
							};
							showPicture.src = URL.createObjectURL(file);
						}
						catch (e) {
							try {
								var fileReader = new FileReader();
								fileReader.onload = function (event) {
									showPicture.onload = function(event) {
										Result.innerHTML="";
										console.log("filereader");
										JOB.DecodeImage(showPicture);
									};
									showPicture.src = event.target.result;
								};
								fileReader.readAsDataURL(file);
							}
							catch (e) {
								Result.innerHTML = "Neither createObjectURL or FileReader are supported";
							}
						}
					}
				};
			}

});

// If we are in the page of creating/editing the object
$(document).on("pagebeforeshow","#to_edeate", function(){
	takePicture = document.querySelector("#shoot_save");

	var showPicture = document.createElement("img");
			//Result = document.querySelector("#error_scan_2");
			var canvas = document.getElementById("save_image");
			var ctx = canvas.getContext("2d");
			JOB.Init();
			JOB.SetImageCallback(function(result) {
				if(result.length > 0){
					var tempArray = [];
					for(var i = 0; i < result.length; i++) {
						tempArray.push(result[i].Value);
					}
				} else {
					if(result.length === 0) {
						//Result.innerHTML="Decoding failed.";
					}
				}
			});
			JOB.PostOrientation = true;
			JOB.OrientationCallback = function(result) {
				canvas.width = result.width;
				canvas.height = result.height;
				var data = ctx.getImageData(0,0,canvas.width,canvas.height);
				for(var i = 0; i < data.data.length; i++) {
					data.data[i] = result.data[i];
				}
				ctx.putImageData(data,0,0);
			};
			JOB.SwitchLocalizationFeedback(true);
			JOB.SetLocalizationCallback(function(result) {
				ctx.beginPath();
				ctx.lineWIdth = "2";
				ctx.strokeStyle="red";
				for(var i = 0; i < result.length; i++) {
					ctx.rect(result[i].x,result[i].y,result[i].width,result[i].height); 
				}
				ctx.stroke();
			});
			if(takePicture && showPicture) {
				takePicture.onchange = function (event) {
					var files = event.target.files;
					if (files && files.length > 0) {
						file = files[0];
						try {
							var URL = window.URL || window.webkitURL;
							showPicture.onload = function(event) {
								//Result.innerHTML="";
								JOB.DecodeImage(showPicture);
								URL.revokeObjectURL(showPicture.src);
							};
							showPicture.src = URL.createObjectURL(file);
						}
						catch (e) {
							try {
								var fileReader = new FileReader();
								fileReader.onload = function (event) {
									showPicture.onload = function(event) {
										//Result.innerHTML="";
										console.log("filereader");
										JOB.DecodeImage(showPicture);
									};
									showPicture.src = event.target.result;
								};
								fileReader.readAsDataURL(file);
							}
							catch (e) {
								//Result.innerHTML = "Neither createObjectURL or FileReader are supported";
							}
						}
					}
				};
			}
	
});
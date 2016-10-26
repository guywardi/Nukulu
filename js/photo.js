var input = document.querySelector('input[id="photo"]');

input.onchange = function () {
  var file = input.files[0];

  //upload(file);
  drawOnCanvas(file);   // see Example 6
  //displayAsImage(file); // see Example 7
};

// function upload(file) {
//   var form = new FormData(),
//       xhr = new XMLHttpRequest();

//   form.append('image', file);
//   xhr.open('post', 'server.php', true);
//   xhr.send(form);
// }


function drawOnCanvas(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var dataURL = e.target.result,
        c = document.querySelector('canvas'), // see Example 4
        ctx = c.getContext('2d'),
        img = new Image();

    img.onload = function() {
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    img.src = dataURL;
  };

  reader.readAsDataURL(file);
}
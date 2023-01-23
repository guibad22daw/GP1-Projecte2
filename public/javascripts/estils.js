var canvas = document.getElementById('logo');
if (canvas.getContext) {

    var ctx = canvas.getContext('2d');
    imatge = new Image();
    imatge.src = 'logo2.png';
    imatge.onload = function () {
        ctx.drawImage(imatge, 0, 5, 80, 53);
    }
}

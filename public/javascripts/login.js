window.onload = function () {
    var canvas = document.getElementById('logo');
    if (canvas.getContext) {

        var ctx = canvas.getContext('2d');
        imatge = new Image();
        imatge.src = './images/logo.png';
        imatge.onload = function () {
            ctx.drawImage(imatge, 25, 15, 250, 175);
        }
    }
}
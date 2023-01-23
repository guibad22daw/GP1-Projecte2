var video = document.getElementById("video");
var estat = document.getElementById("estat");
var temps = document.getElementById("temps");



 function reproduir(){
    video.play();
 }

 function pausar(){
    video.pause();
 }

 function anarInici() {
   video.currentTime = 0;
   video.pause();
 }

 function anarFinal() {
   video.currentTime = video.duration;
 }

 setInterval(mostraTemps, 1000);

 function mostraTemps(){
   temps.innerHTML=video.currentTime;
 }
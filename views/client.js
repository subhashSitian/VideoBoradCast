var socket = io.connect('http://localhost:4000');

var videoDiv = document.getElementById('video');


//var playBtn = document.getElementById('playBtn');
var data ="video.mp4";

//playBtn.addEventListener('click',function(){

	//setInterval(function(){
		socket.emit('video',data);
	//},1000);
	

//	});

var imgChuncks =[];


socket.on('video',function(data){
	videoDiv.innerHTML ='<video id="videoId" width="780" autoplay playsinline loop preload controls><source src="'+data+'" type="video/mp4"></video> ';
	

});


socket.on('img-chunk',function(chunk){
	var img =document.getElementById('imgStream');
	imgChuncks.push(chunk);
	alert(imgChuncks);
	img.setAttribute('src','data:image/jpeg;base64,'+ window.btoa(imgChuncks));

});

document.getElementById('vid').play();



// get all nodelinks from svg
var links = document.getElementsByClassName("link");

// loop 
for (var i = 0; i < links.length; i++){
  // create random color
	randomBlue = Math.floor(Math.random()*50);
	randomGreen = Math.floor(Math.random()*130+30);
	randomRed = Math.floor(Math.random()*200+50);
	//finalColor = "rgba(255,255," + randomBlue + "," + Math.random() + ")";
	finalColor = "rgb(240," + randomGreen + "," + randomBlue + ")";
	// Blueize current node link
	links[i].style.stroke = finalColor;
}

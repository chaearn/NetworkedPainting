var hi,sa,br,w;
var color;
var clear = 0;
var alte = 0;
var osc = require('node-osc');
var ipInput, remotePortInput, localPortInput;
var connect = false;
var remoteIP;
var remotePort;
var localPort;
var button;
var mytext, desc, connection;
var font;
var window_w;
var window_h;

function preload(){
	font = loadFont('font/akkurat.ttf');
}

function setup() {
	// font = loadFont('font/akkurat.ttf');
	window_w = windowWidth;
	window_h = windowHeight;
	var dw = 800;
	var dh = 600;
 	createCanvas(displayWidth, displayHeight);
 	
	colorMode(HSB);
	background(0,0,94);
	hi = sa = 0;
	br = 255;	
	stroke(hi,sa,br);

	// remoteDraw();
	// textSize(32);
	// textFont(font);
	// mytext = text("Let's draw!", (window_w/2)-75, 250);

	remoteIP = createInput("Remote IP Address");
	remoteIP.style('border-style', 'none');
	remoteIP.style('height', '30px');
	remoteIP.style('text-align', 'center');
	remoteIP.style('color', 'gray');
	remoteIP.style('border-radius', '4px');
	remoteIP.input(myRemoteIP);

	remotePort = createInput("Remote Port");
	remotePort.style('border-style', 'none');
	remotePort.style('height', '30px');
	remotePort.style('text-align', 'center');
	remotePort.style('color', 'gray');
	remotePort.style('border-radius', '4px');
	remotePort.input(myRemotePort);

	localPort = createInput("Local Port");
	localPort.style('border-style', 'none');
	localPort.style('height', '30px');
	localPort.style('text-align', 'center');
	localPort.style('color', 'gray');
	localPort.style('border-radius', '4px');
	localPort.input(mylocalPort);

	button = createButton('Connect!');
	button.style('border-style', 'none');
	button.style('height', '30px');
	button.style('background-color', 'black');
	button.style('color', 'white');
	button.style('padding-left', '15px');
	button.style('padding-right', '15px');
	button.style('text-align', 'center');
	button.style('border-radius', '4px');
	button.mousePressed(connecting);
}

function draw(){

	window_w = windowWidth;
	window_h = windowHeight;
	if (!connect) {
		background(0,0,94);
		textSize(32);
		textFont(font);
		mytext = text("Let's draw!", (window_w/2)-75, (window_h/2)-50);
		remoteIP.position((window_w/2)-250,(window_h/2));
		remotePort.position(remoteIP.x + remoteIP.width+ 15,(window_h/2));
		localPort.position(remotePort.x + remotePort.width+ 15,(window_h/2));
		button.position(localPort.x + localPort.width+ 20,(window_h/2));
		textSize(10);
		fill(0,0,40);
		desc = text("Hold down mouse or trackpad to randomize your brush color, pressed 'alt' to toggle eraser, to clear the canvas press 'delete'.", (window_w/2)-278, window_h-20);

	}
	

	drawLine();
	clearCanvas();

	if (connect == true) {
		sendData();
		// remoteIP.style('visibility', 'hidden');
		remoteIP.hide();
		remotePort.hide();
		localPort.hide();
		button.hide();
		
		// mytext.hide();
	} else {
		// textSize(32);
		// text("LET'S DRAW!", (dw/2)-75, 250);
	}
	
	
}

function drawLine(){
	w = random(3,10);
	strokeWeight(w);
	stroke(hi,sa,br);
	line(mouseX, mouseY, pmouseX, pmouseY);
}

function clearCanvas(){
	if (keyIsDown(BACKSPACE) && clear ==0) {
		// colorMode(RGB);
    	background(0,0,94);
    	hi = sa = 0;
    	br =255;
    	// stroke(255);
    	clear = 1;

    	if (!connect) {
  			noStroke();
  			textSize(32);
			textFont(font);
  			mytext = text("Let's draw!", (window_w/2)-75, (window_h/2)-50);

  		} else {
  			noStroke();
  			connection = text("You are now connected to" + ipInput + " : " + remotePortInput, (window_w/2)-76, window_h-33);
	 		desc = text("Hold down mouse or trackpad to randomize your brush color, pressed 'alt' to toggle eraser, to clear the canvas press 'delete'.", (window_w/2)-278, window_h-20);

  		}

  	} else {
  		clear = 0;
  	}

  	
}

function mouseDragged() {
	hi = floor(random(255));
	sa = floor(random(100));
	br = floor(random(100));
	// console.log(hi,',',sa,',',br);
	return false;
	// sendData();
}

function keyPressed(){
	if (keyCode == ALT && alte ==0) {
		hi = sa = 0;
		br = 94;
    	alte = 1;
  	} else {
  		alte = 0;
  	}
}

function myRemoteIP(){

	ipInput = this.value();
}

function myRemotePort(){
	remotePortInput = this.value();
}

function mylocalPort(){
	localPortInput = this.value();
}

function connecting(){
	connect = true;
	remoteDraw();
	fill(0,0,94);
	noStroke();
	rect((window_w/2)-75, (window_h/2)-100, 200, 80);
	textFont(font);
	textSize(10);
	fill(0,0,40);
	connection = text("You are now connected to" + ipInput + " : " + remotePortInput, (window_w/2)-76, window_h-33);

}

function sendData(){
// console.log("AAA");
// var osc = require('node-osc');

var client = new osc.Client(ipInput, localPortInput);
client.send('/oscAddress', 200, '/brushPosition', mouseX, mouseY, pmouseX, pmouseY, '/brushStroke', w, '/brushColor', hi,sa,br, '/clearStatus', clear, '/altStatus', alte, function () {
// 	// console.log(hi, sa, br);
	client.kill();
});
}

function remoteDraw(){
	console.log("AAA");

	var oscServer = new osc.Server(remotePortInput, '0.0.0.0');

	oscServer.on("message", function (msg, rinfo) {
		console.log("Position:");
		console.log(msg[3]);
		console.log(msg[4]);
		console.log(msg[5]);
		console.log(msg[6]);
		console.log("Stroke:");
		console.log(msg[8]);
		console.log("Color:");
		console.log(msg[10]);
		console.log(msg[11]);
		console.log(msg[12]);
		console.log("Clear Status:");
		console.log(msg[14]);
		console.log("Alt Status:");
		console.log(msg[16]);

		strokeWeight(msg[8]);
		stroke(msg[10],msg[11],msg[12]);
		

		if (msg[14] == 1) {
    		background(0,0,94);
    		stroke(255);
    	}

    	if (msg[16] ==1) {
    		hi = sa = 0;
			br = 94;
			// alte = 0;
  		} else {
  			alte = 0;
  		}

  		line(msg[3], msg[4], msg[5], msg[6]);

});
}
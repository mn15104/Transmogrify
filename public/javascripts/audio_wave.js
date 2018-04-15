var events = new Events();
function init() {

    document.onselectstart = function() {
        return false;
    };
    document.addEventListener('drop', onDocumentDrop, false);
    document.addEventListener('dragover', onDocumentDragOver, false);

    init_aud();
    init_cont();
    update();

}

var stopshit = function (){
	emergencyDropSound();
}
var update = function () {
    requestAnimationFrame(update);
    events.emit("update");
}

function onDocumentDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return false;
}
function onDocumentDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    onMP3Drop(evt);
}

var audioParams = {
	useMic:false,
	useSample:true,
	volSens:1,
	beatHoldTime:40,
	beatDecayRate:0.97,
	sampleURL: "../res/AJJ.mp3"
}

var init_cont = function (){

	//Init DAT GUI control panel
	gui = new dat.GUI({autoPlace: false });
	$('#music_visual_controls').append(gui.domElement);
	var f2 = gui.addFolder('Settings');
	f2.add(audioParams, 'useMic').listen().onChange(onUseMic).name("Use Mic");
	f2.add(audioParams, 'volSens', 0, 5).step(0.1).name("Gain");
	f2.add(audioParams, 'beatHoldTime', 0, 100).step(1).name("Beat Hold");
	f2.add(audioParams, 'beatDecayRate', 0.9, 1).step(0.01).name("Beat Decay");
	f2.open();

	onUseMic();
	onUseSample();

}



var waveData = []; //waveform - from 0 - 1 . no sound is 0.5. Array [binCount]
var levelsData = []; //levels of each frequecy - from 0 - 1 . no sound is 0. Array [levelsCount]
var level = 0; // averaged normalized level from 0 - 1
var bpmTime = 0; // bpmTime ranges from 0 to 1. 0 = on beat. Based on tap bpm
var ratedBPMTime = 550;//time between beats (msec) multiplied by BPMRate
var levelHistory = []; //last 256 ave norm levels
var bpmStart; 

var sampleAudioURL = "../res/mp3/Cissy_Strut_Edit.mp3";
var BEAT_HOLD_TIME = 40; //num of frames to hold a beat
var BEAT_DECAY_RATE = 0.98;
var BEAT_MIN = 0.15; //a volume less than this is no beat

//BPM STUFF
var count = 0;
var msecsFirst = 0;
var msecsPrevious = 0;
var msecsAvg = 633; //time between beats (msec)

var timer;
var gotBeat = false;
var beatCutOff = 0;
var beatTime = 0;

var debugCtx;
var debugW = 330;
var debugH = 350;
var chartW = 300;
var chartH = 150;
var aveBarWidth = 30;
var debugSpacing = 2;
var gradient;

// console.log(amp);
var freqByteData; //bars - bar data is from 0 - 256 in 512 bins. no sound is 0;
var timeByteData; //waveform - waveform data is from 0-256 for 512 bins. no sound is 128.
var levelsCount = 32; //should be factor of 512

var binCount; //512
var levelBins;

var isPlayingAudio = false;

var source;
var buffer;
var audioBuffer;
var dropArea;
var audioContext;
var analyser;

var init_aud = function() {

	//EVENT HANDLERS
	events.on("update", update_aud);

	//Get an Audio Context
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		audioContext = new window.AudioContext();
	} catch(e) {
		//Web Audio API is not supported in this browser
		$('#music_visual_info').append('Sorry!<br>This browser does not support the Web Audio API. Please use Chrome, Safari or Firefox.');
		$('#music_visual_controls').hide();
		return;
	}

	analyser = audioContext.createAnalyser();
	analyser.smoothingTimeConstant = 0.8; //0<->1. 0 is no time smoothing
	analyser.fftSize = 1024;
	analyser.connect(audioContext.destination);
	binCount = analyser.frequencyBinCount; // = 512

	levelBins = Math.floor(binCount / levelsCount); //number of bins in each level

	freqByteData = new Uint8Array(binCount); 
	timeByteData = new Uint8Array(binCount);

	var length = 256;
	for(var i = 0; i < length; i++) {
		levelHistory.push(0);
	}

	//INIT DEBUG DRAW
	var canvas = document.getElementById("music_visual_audioDebug");
	debugCtx = canvas.getContext('2d');
	debugCtx.width = debugW;
	debugCtx.height = debugH;
	debugCtx.fillStyle = "rgb(40, 40, 40)";
	debugCtx.lineWidth=2;
	debugCtx.strokeStyle = "rgb(255, 255, 255)";
	$('#music_visual_audioDebugCtx').hide();

	gradient = debugCtx.createLinearGradient(0,0,0,256);
	gradient.addColorStop(1,'#330000');
	gradient.addColorStop(0.75,'#aa0000');
	gradient.addColorStop(0.5,'#aaaa00');
	gradient.addColorStop(0,'#aaaaaa');

}

var initSound = function(){
	source = audioContext.createBufferSource();
	source.connect(analyser);
}

//load sample MP3
var loadSampleAudio = function() {

	stopSound();

	initSound();
	
	// Load asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", audioParams.sampleURL, true);
	request.responseType = "arraybuffer";

	request.onload = function() {


		audioContext.decodeAudioData(request.response, function(buffer) {
			audioBuffer = buffer;
			startSound();
		}, function(e) {
			console.log(e);
		});


	};
	request.send();
}

var onTogglePlay = function (){

	if (play){
		startSound();
	}else{
		stopSound();
	}
}

var startSound = function() {
	source.buffer = audioBuffer;
	source.loop = true;
	source.start(0.0);
	isPlayingAudio = true;
	//startViz();

	$("#music_visual_preloader").hide();
}

var stopSound = function(){
	isPlayingAudio = false;
	
	if(source){
	source.stop(0);
	source.disconnect();
	}
	debugCtx.clearRect(0, 0, debugW, debugH);
}
var emergencyDropSound =function (){
	isPlayingAudio = false;

	source.stop(0);
	source.disconnect();
	
	debugCtx.clearRect(0, 0, debugW, debugH);
}
var onUseMic = function (){

	if (audioParams.useMic){
		audioParams.useSample = false;
		getMicInput();
	}else{
		stopSound();
	}
}

var onUseSample = function (){
	if (audioParams.useSample){
		loadSampleAudio();          
		audioParams.useMic = false;
	}else{
		stopSound();
	}
}
//load dropped MP3
var onMP3Drop = function (evt) {

	//TODO - uncheck mic and sample in CP

	audioParams.useSample = false;
	audioParams.useMic = false;

	stopSound();
	initSound();

	var droppedFiles = evt.dataTransfer.files;
	var reader = new FileReader();
	reader.onload = function(fileEvent) {
		var data = fileEvent.target.result;
		onDroppedMP3Loaded(data);
	};
	reader.readAsArrayBuffer(droppedFiles[0]);
}

//called from dropped MP3
var onDroppedMP3Loaded = function (data) {

	if(audioContext.decodeAudioData) {
		audioContext.decodeAudioData(data, function(buffer) {
			audioBuffer = buffer;
			startSound();
		}, function(e) {
			console.log(e);
		});
	} else {
		audioBuffer = audioContext.createBuffer(data, false );
		startSound();
	}
}


// $(function() {
//     // Generic function to set blur radius of $ele


//     // Start tweening towards blurred image
//     window.setTimeout(function() {
//         tweenBlur('.item', 0, 10);
//     }, 1000);

//     // Reverse tweening after 3 seconds
//     window.setTimeout(function() {
//         tweenBlur('.item', 10, 0);
//     }, 3000);
// });
//called every frame
//update published viz data
function update_aud(){
	if (!isPlayingAudio) return;
	//GET DATA
	analyser.getByteTimeDomainData(timeByteData); // <-- waveform

	//console.log(freqByteData);

	//normalize waveform data
	for(var i = 0; i < binCount; i++) {
		waveData[i] = ((timeByteData[i] - 128) /128 )* audioParams.volSens;
	}

	//GET AVG LEVEL
	var sum = 0;
	for(var j = 0; j < levelsCount; j++) {
		sum += levelsData[j];
	}
	
	level = sum / levelsCount;
	amp = sum / levelsCount;
	// $.getScript("explore.js",function(){
	// 	setBlur(level);
	// 	// setBlur(LEV);
	// });
	levelHistory.push(level);
	levelHistory.shift(1);

	//BEAT DETECTION
	if (level  > beatCutOff && level > BEAT_MIN){
		onBeat();
		beatCutOff = level *1.1;
		beatTime = 0;
	}else{
		if (beatTime <= audioParams.beatHoldTime){
			beatTime ++;
		}else{
			beatCutOff *= audioParams.beatDecayRate;
			beatCutOff = Math.max(beatCutOff,BEAT_MIN);
		}
	}


	bpmTime = (new Date().getTime() - bpmStart)/msecsAvg;
	

	debugDraw();
}



var debugDraw = function (){

	debugCtx.clearRect(0, 0, debugW, debugH);
	//draw chart bkgnd
	// debugCtx.fillRect(0,0,debugW,debugH);

	//DRAW AVE LEVEL + BEAT COLOR
	if (beatTime < 6){
		// debugCtx.fillStyle="#FFF";
	}
	debugCtx.fillRect(chartW, chartH, aveBarWidth, -level*chartH);
	debugCtx.strokeStyle = "rgb(200, 250, 50)";
	debugCtx.beginPath();
	debugCtx.moveTo(chartW , chartH - beatCutOff*chartH - 10);
	debugCtx.lineTo(chartW + aveBarWidth, chartH - beatCutOff*chartH-10);
	debugCtx.stroke();
	//DRAW WAVEFORM
	debugCtx.beginPath();
	for(var i = 0; i < binCount; i++) {
		debugCtx.lineTo(i/binCount*chartW, waveData[i]*chartH/2 + chartH/2);
	
	}
	debugCtx.stroke();

}

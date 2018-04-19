import React, { Component } from 'react';
import Tone from 'tone'
import './App.css';

// source from https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack
// allows me to require all files from a directory without having to import every single one
function importAll(file) {
  let files = {}
  file.keys().map((item, index) => {
    return files[item.replace('../sounds/soundFiles/', '')] = file(item)
  });
  return files
}

const soundFiles = importAll(require.context('../sounds/soundFiles/', false, /\.(mp3|wav)$/))

// https://css-tricks.com/introduction-web-audio-api/ to start the set up of oscillator sounds from Web Audio API 
let context = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;
let tones = []
let audio;

// var MEDIA_ELEMENT_NODES = new WeakMap()
var cxt, analyser, analyserElement, audioSource, canvas;

let number;

// keyCode for all letters of keyboard, QWERTY order
let keyCode = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191]

// created a state so instead of just music from one file to be played
// can select multiple types of music depending on user input
class App extends Component {
  constructor() {
    super()
    this.state = {
      selected: 'Piano',
      visuals: undefined,
      active: false
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
    this.makeCircles = this.makeCircles.bind(this)
    this.deleteCircles = this.deleteCircles.bind(this)
    this.makeTones = this.makeTones.bind(this)
    this.randomNum = this.randomNum.bind(this)

    this.initializeAnalyser = this.initializeAnalyser.bind(this)
    // this.makeAudioVisual = this.makeAudioVisual.bind(this)
    this.toggle = this.toggle.bind(this)
  }


  // adds listener to page
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false)
    document.addEventListener('keyup', this.handleKeyUp, false)
    document.getElementById('sketch')
    this.initializeAnalyser()
    this.makeTones()
  }

  toggle (e) {
    console.log(this.state.active)
    this.setState((prevState) => { return { active: !prevState.active }} )
  }


  // used http://ianreah.com/2013/02/28/Real-time-analysis-of-streaming-audio-data-with-Web-Audio-API.html tutorial to create the analysis and bars but 
  // couldn't figure out how to connect it to keys being played so now it's just css decoration
  initializeAnalyser () {
    var music = new Audio()
    music.src = require('./dub.mp3')
    music.autoplay = true
    music.loop = true

    var cxt =  new (window.AudioContext || window.webkitAudioContext)();
    var audioSource = cxt.createMediaElementSource(music)


    var analyser = cxt.createAnalyser()         //analysizes frequency of audio

    audioSource.connect(analyser)
    // audioSource.connect(cxt.destination)


    var frequencyData = new Uint8Array(analyser.frequencyBinCount)        // gets values from analyser in array
    console.log(frequencyData)
    var canvas = document.getElementById('canvas'),         // define things inside canvas element
      cwidth = canvas.width,
      cheight = canvas.height - 2,
      meterWidth = 2,
      gap = 20,
      meterNum = 1000/ 5,

      cxt = canvas.getContext('2d'),
      gradient = cxt.createLinearGradient(0, 0, 0, 300);

      function makeBars() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum);   //sample limited data from the total array
        cxt.clearRect(0, 0, cwidth, cheight);

        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step]
            cxt.fillStyle = 'rgba(255,255,255, 0.55)'
            cxt.fillRect(i * 12, cheight - value, meterWidth, cheight)   // the meter
        }
        requestAnimationFrame(makeBars);
      }

      makeBars()
    
  }


  randomNum(max) {     // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    return Math.floor(Math.random(40) * Math.floor(max))
  }


  makeCircles () {      // creates circles in canvas
    var x = this.randomNum(1000)     // random values for circle position, size, and color
    var y = this.randomNum(300)
    var r = this.randomNum(100)
    var colorIndex = this.randomNum(6)

    var color = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']

    if (this.state.visuals === undefined) {
      this.setState({ visuals: React.createElement('svg', {
        width: '1000', height: '300'}, React.createElement('circle', {
          cx: x, cy: y, r: r, stroke: 'none', fill: color[colorIndex]
        }))
      })
    }
  }

  deleteCircles () {
    if (this.state.visuals !== undefined) {
      this.setState({ visuals: undefined })
    }
  }


  createOscSounds(e) {        // requires own function b/c oscillators will not start again once stopped
    oscillator = context.createOscillator()
    let gainNode = context.createGain()

        if (this.state.selected === 'Sawtooth') {           // sets master volume of tone bc sawtooth is obnoxiously loud
          gainNode.gain.value = 0.1
        } else {
          gainNode.gain.value = 0.4
        }
    
        oscillator.connect(gainNode)
        gainNode.connect(context.destination)
        oscillator.type = this.state.selected.toLowerCase()
    
        oscillator.start(context.currentTime)

        oscillator.stop(context.currentTime + 0.2)        // stops oscillator after 0.2 seconds
  
  }

  makeTones() {                 // makes a range of frequencies
    let start = 1100
    for (let i = 0; i < keyCode.length; i++) {
      start = start - 30
      tones.push(start)
    }
  }


  handleKeyDown(e) {        // plays a note base on keyboard selection
    e.preventDefault()
    this.makeCircles()   
    this.toggle()
    if (this.state.selected === 'Triangle' || this.state.selected === 'Sawtooth' || this.state.selected === 'Sine') {   // for oscillator pitches
      this.createOscSounds()
      for (let i = 0; i < keyCode.length; i++) {
        if (e.keyCode === keyCode[i]) {             // changes pitch of each sound
          oscillator.frequency.value = tones[i]
        }
      }
    }

    for (let i = 0; i < keyCode.length; i++) {
      if (e.keyCode === keyCode[i]) {

        let key = document.getElementById(`${i}`)           // colors the key on screen
        key.style.backgroundColor = 'rgb(143, 242, 255)'

        
        if (this.state.selected === 'HarderBetter') {     // plays the notes from the sound files
          document.getElementById(`audio${[i]}`).play()
        } else if (this.state.selected === 'Piano') {
          number = i + 34
          console.log(number)
          // this.initializeAnalyser()
          
          document.getElementById(`audio${[i + 34]}`).play()
        }
      }
    }
  }
  

  handleKeyUp(e) {          // allows note to be played without waiting for sound file to end
    this.deleteCircles()        // gets rid of circles on screen
    this.toggle()
    for (let i = 0; i < keyCode.length; i++) {
      if (e.keyCode === keyCode[i]) {
        let key = document.getElementById(`${i}`)   // changes key color back to normal
        key.style.backgroundColor = 'rgba(255,255,255, 0.55)'

        if (this.state.selected === 'HarderBetter') {   // starts sound files from time 0 
          document.getElementById(`audio${[i]}`).currentTime = 0;   
        } else if (this.state.selected === 'Piano') {
          this.toggle()
          document.getElementById(`audio${[i + 34]}`).currentTime = 0;
        }
      }
    }
  }

  handleSelected(e) {   // allows user selection of sounds to play on keyboard
    let selected = e.target.value
    this.setState({ selected: selected })
  }

  render() {

    let music = Object.keys(soundFiles).map((file, i) => {        // creates all the sound files to be played
      return (
        <div key={i}>
          <audio onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} id={`audio${i}`} className="audio" controls src={soundFiles[`${file}`]} />
        </div>
      )
    })


    let keyboard = keyCode.map((letter, i) => {       // creates keyboard on screen
      return (
        <div key={i} className={`keys num${i}`} id={i}>{String.fromCharCode(letter)}</div>
      )
    })

    return (
      <div className="App">
        <h1 className="header">keytones</h1>
        <select className="select" onChange={this.handleSelected}>
          <option>Piano</option>
          <option>Triangle</option>
          <option>Sawtooth</option>
          <option>Sine</option>
          <option>HarderBetter</option>
        </select>

        {music}
   
        <div className="random"> {this.state.visuals} </div> 
        <canvas className="canvas" id='canvas' width="1610" height="200"></canvas>
        <div className="keyboard">
          {keyboard}
        </div>
      </div>
    );
  }
}

export default App

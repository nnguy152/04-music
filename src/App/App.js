import React, { Component } from 'react';
import './App.css';

// Enter in letters in a text box and play text


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

// https://css-tricks.com/introduction-web-audio-api/ to start the set up of oscillator sounds
// from the Web Audio API 
let context = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;
let tones = []

// keyCode for all letters of keyboard, QWERTY order
let keyCode = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]

// created a state so instead of just music from one file to be played
// can select multiple types of music depending on user input
class App extends Component {
  constructor() {
    super()
    this.state = {
      selected: 'Wind Chimes',
      visuals: undefined,
      active: false
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
    this.makeCircles = this.makeCircles.bind(this)
    this.deleteCircles = this.deleteCircles.bind(this)
    this.makeTones = this.makeTones.bind(this)
    this.getRandomInt = this.getRandomInt.bind(this)
    // this.toggle = this.toggle.bind(this)
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  makeCircles () {
    var x = this.getRandomInt(1000)
    var y = this.getRandomInt(300)
    var r = this.getRandomInt(100)
    console.log(`x: ${x}`)
    console.log(`r: ${r}`)

    if (this.state.visuals === undefined) {
      this.setState({ visuals: React.createElement('svg', {
        width: '1000', height: '300'}, React.createElement('circle', {
          cx: x, cy: y, r: r, stroke: 'black', fill: 'white'
        }))
      })
    }
  }

  deleteCircles () {
    if (this.state.visuals !== undefined) {
      this.setState({ visuals: undefined })
    }
  }

  // makes the whole page have a listener
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false)
    document.addEventListener('keyup', this.handleKeyUp, false)
    document.getElementById('sketch')
    this.makeTones()
  }

  // makes a range of frequencies
  makeTones() {
    let start = 1100
    for (let i = 0; i < keyCode.length; i++) {
      start = start - 30
      tones.push(start)
    }
  }

  // plays a note base on keyboard selection
  handleKeyDown(e) {
    e.preventDefault()
    this.makeCircles()
    // this.toggle()
    if (this.state.selected === 'Triangle' || this.state.selected === 'Sawtooth' || this.state.selected === 'Sine') {
      // console.log('keydown')
      this.createOscSounds()
      for (let i = 0; i < keyCode.length; i++) {
        // changes pitch of each sound
        if (e.keyCode === keyCode[i]) {
          oscillator.frequency.value = tones[i]
        }
      }
    }

    for (let i = 0; i < keyCode.length; i++) {
      if (e.keyCode === keyCode[i]) {
        // this.setState({keyLetter: String.fromCharCode(keyCode[i])})
        let key = document.getElementById(`${i}`)
        key.style.backgroundColor = 'rgb(143, 242, 255)'
        if (this.state.selected === 'Wind Chimes') {
          document.getElementById(`audio${[i]}`).play()
        } else if (this.state.selected === 'Piano') {
          document.getElementById(`audio${[i + 25]}`).play()
        }
      }
    }
  }

  // requires own function b/c oscillators will not start again once stopped
  createOscSounds(e) {
    // console.log('triangle function')
    oscillator = context.createOscillator()
    let gainNode = context.createGain()

    // sets master volume of tone
    if (this.state.selected === 'Sawtooth') {
      gainNode.gain.value = 0.1
    } else {
      gainNode.gain.value = 0.4
    }

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.type = this.state.selected.toLowerCase()

    oscillator.start(context.currentTime)

    // stops oscillator after 0.2 seconds
    oscillator.stop(context.currentTime + 0.2)
  }

  // allows note to be played without waiting for sound file to end
  handleKeyUp(e) {
    this.deleteCircles()
    for (let i = 0; i < keyCode.length; i++) {
      if (e.keyCode === keyCode[i]) {
        let key = document.getElementById(`${i}`)
        key.style.backgroundColor = 'rgba(255,255,255, 0.55)'
        if (this.state.selected === 'Wind Chimes') {
          document.getElementById(`audio${[i]}`).currentTime = 0;
        } else if (this.state.selected === 'Piano') {
          document.getElementById(`audio${[i + 25]}`).currentTime = 0;
        }
      }
    }
  }

  handleSelected(e) {
    let selected = e.target.value
    this.setState({ selected: selected })
  }


  // toggle(e) {
    // console.log(this.state.active)
    // this.setState((prevState) => { return { active: !prevState.active }} )
  // }

  render() {
    // creates all the sound files to be played
    let music = Object.keys(soundFiles).map((file, i) => {
      return (
        <audio key={i} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} id={`audio${i}`} controls src={soundFiles[`${file}`]} />
      )
    })

    // creates keyboard on screen
    let keyboard = keyCode.map((letter, i) => {
      return (
        <div key={i} className={`keys num${i}`} id={i}>{String.fromCharCode(letter)}</div>
      )
    })

    return (
      <div className="App">
        <h1 className="header">keytones</h1>
        <select className="select" onChange={this.handleSelected}>
          <option>Wind Chimes</option>
          <option>Piano</option>
          <option>Triangle</option>
          <option>Sawtooth</option>
          <option>Sine</option>
        </select>

        {music}

        <br />

        <div className="random">{this.state.visuals}</div>
        <div className="keyboard">
          {keyboard}
        </div>
      </div>
    );
  }
}

export default App;

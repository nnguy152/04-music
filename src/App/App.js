import React, { Component } from 'react';
import './App.css';

// fource from https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack
// allows me to require all files from a directory without having to import every single one
function importAll(file) {
  let files = {};
  file.keys().map((item, index) => { 
    return files[item.replace('../sounds/histheme/', '')] = file(item); 
  });
  return files
}

const histheme = importAll(require.context('../sounds/histheme/', false, /\.(mp3|wav)$/));

// reassign these to id of audio file
var keyCode = [
  81, // q
  87, // w
  69, // e
  82, // r
  84, // t
  89, // y
  85, // u
  73, // i
  79, // o
  80, // p

  65, // a
  83, // s
  68, // d
  70, // f
  71, // g
  72, // h
  74, // j
  75, // k
  76, // l

  90, // z
  88, // x
  67, // c
  86, // v
  66, // b
  78, // n
  77 // m
]

// created a state so instead of just music from one file to be played
// can select multiple types of music depending on user input
class App extends Component {
  constructor () {
    super()
    this.state = {
      selected: 'Wind Chimes'
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleSelected = this.handleSelected.bind(this)
  }

  // makes the whole page have a listener
  componentDidMount (){
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  }

  // plays a note base on keyboard selection
  handleKeyDown (e) {
    console.log(keyCode.length)
     for (let i = 0; i < keyCode.length; i++) {
      if (e.keyCode === keyCode[i]) {
        if (this.state.selected === 'Wind Chimes') {
          document.getElementById(`audio${[i]}`).play();
          console.log(histheme[`audio${[i]}`])
        } 
        else if (this.state.selected === 'Piano') {
          document.getElementById(`audio${[i + 25]}`).play();
        }
      }
    }
  }

   // allows note to be played without waiting for sound file to end
   handleKeyUp (e) {
     for (let i = 0; i < keyCode.length; i++) {
      if (e.keyCode === keyCode[i]) {
        if (this.state.selected === 'Wind Chimes') {
        document.getElementById(`audio${[i]}`).currentTime = 0;
        }
        else if (this.state.selected === 'Piano') {
          document.getElementById(`audio${[i + 25]}`).currentTime = 0;
        }
      }
    }
  }

   handleSelected (e) {
    //  console.log('hi')
    //  console.log(e.target.value)  
     let selected = e.target.value
     this.setState({selected: selected})
   }

  render() {
    // console.log(this.state.selected)
    // let choice = this.state.selected
    // console.log(choice)

        // creates all the sound files to be played
        let music = Object.keys(histheme).map((file, i) => {
          return (
            <audio key={i} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} id={`audio${i}`} controls src={histheme[`${file}`]} />
          )
        })
    return (
      <div>
        wow
        <select onChange={this.handleSelected}>
          <option>Wind Chimes</option>
          <option>Piano</option>
        </select>
          {music}

      </div>
    );
  }
}

export default App;

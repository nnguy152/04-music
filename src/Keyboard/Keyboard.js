import React, { Component } from 'react';
import './Keyboard.css'

let keyboardLetters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h','j','k','l','z','x','c','v','b','n','m']

class Keyboard extends Component {

  render() {
    let keyboard = keyboardLetters.map(letter => {
      console.log(letter.toUpperCase())
      return ( 
        <div className="keys">{letter.toUpperCase()}</div>
      )
    })
    return (
      <div className="keyboard">
        {keyboard}
      </div>
    );
  }
}

export default Keyboard;
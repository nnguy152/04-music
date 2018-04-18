// import React, { Component } from 'react';
// import './Keyboard.css'

// let keyboardLetters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h','j','k','l','z','x','c','v','b','n','m']

// class Keyboard extends Component {

//   render() {
//     // console.log(this.props.keyLetter)
//     console.log(this.props.active)
//     let keyboard = keyboardLetters.map(letter => {
//       return ( 
//         <div className="keys" style={{background: this.props.active ? "rgba(255,255,255, 0.55)" : "none" }}>{letter.toUpperCase()}</div>
//       )
//     })
//     return (
//       <div className="keyboard">
//         {keyboard}
//       </div>
//     );
//   }
// }

// export default Keyboard;
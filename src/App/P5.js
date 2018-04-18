import React, { Component } from 'react';

 var Sketch = React.createElement('svg', {
    width: '640', height: '480'}, React.createElement('circle', {
      cx: '50', cy: '50', r: '40', stroke: 'black', fill: 'white'
    }))
 
 class P5 extends Component {
    render() {
       return (
          <div>
             {Sketch}
          </div>
       );
    }
 }


export default P5;
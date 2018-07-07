import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    start: false,
    dataWindowSize: {
      x: 1000,
      y: 500
    },
    samplingFrequency: 1,
    initialDelay: 0,
    periods: 1,
    oscillationFrequency: 1
  }

  componentDidMount() {
    /*
    TO DO(s)
      1. Oscillation frequency.
      2. Number of periods / cycles.
      3. Initial delay.
      4. Data window size.
      5. Sampling frequency (optional).

    Recap of wave physics:
      Y (position) and t (time) are the axis.
      A is Amplitude, also known as maximum distance from Y0. Y is always lower or equal than A but never higher.
      T is period. A period is the t between two points with maximum A.
      W is Angular Velocity, calculated from 2PI/T.
      Oscillation Frequency is the time it takes to reach from Y T0 to A twice (one positive, one negative) and return back to its original Y value.
      Initial Delay is the difference between Y0 and Y at T0.
      Sampling Frequency is the number of samples per second that the machine captures (also known as FPS).
    */
    var oscillationFrequency = this.state.oscillationFrequency;
    var periods = this.state.periods;
    var initialDelay = this.state.initialDelay;
    var time = 0;
    const FPS = this.state.samplingFrequency;
    setInterval(() => {
      var samplingFrequency = document.getElementById('samplingFrequency').value;
      time = time + samplingFrequency;
      var canvas = document.getElementById("myCanvas");
      if (canvas !== null) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.5);
        var cnt = 0;
        if (initialDelay !== 0) {
          ctx.lineTo(cnt, initialDelay);
          cnt += 1;
        }
        for (cnt; cnt <= canvas.width; cnt++) {
          ctx.lineTo(cnt, canvas.height * 0.5 - (Math.random() * 2 + Math.cos(time + cnt * 0.05) * 20 ));
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    }, FPS * 1000); // sampling frequency
  }

  onMeasureChange = () => {
    this.setState({
      initialDelay: document.getElementById('initialDelay').value,
      oscillationFrequency: document.getElementById('oscillationFrequency').value,
      periods: document.getElementById('periods').value,
      samplingFrequency: document.getElementById('samplingFrequency').value
    });
  }
  
  start = () => {
    this.setState({ start: !this.state.start });
  }

  render() {
    const { samplingFrequency, dataWindowSize, oscillationFrequency, periods, initialDelay, start } = this.state
    return (
      <div className="App">
        <p>
          <span style={{marginRight: 10}}>
            Oscillation Frequency
          </span>
          <input id="oscillationFrequency" type="number" value={oscillationFrequency} min="1" onChange={this.onMeasureChange}/>
        </p>
        <p>
          <span style={{marginRight: 10}}>
            Number of Periods / Cycles
          </span>
          <input id="periods" type="number" value={periods} min="1" onChange={this.onMeasureChange }/>
        </p>
        <p>
          <span style={{marginRight: 10}}>
            Initial Delay
          </span>
          <input id="initialDelay" type="number" value={initialDelay} min="1" onChange={this.onMeasureChange }/>
        </p>
        <p>
          <span style={{marginRight: 10}}>
            Sampling Frequency
          </span>
          <input id="samplingFrequency" type="number" value={samplingFrequency} min="1" onChange={this.onMeasureChange }/>
        </p>
        {
          start === true
          &&
          <div>
            <canvas id="myCanvas" width={dataWindowSize.x} height={dataWindowSize.y}></canvas>
            <p>
              <button type="button" onClick={this.start}>
                Press to return
              </button>
            </p>
          </div>
        }
        {
          start === false
          &&
          <div>
            <button type="button" onClick={this.start}>
              Press to see
            </button>
          </div>
        }
      </div>
    );
  }
}

export default App;

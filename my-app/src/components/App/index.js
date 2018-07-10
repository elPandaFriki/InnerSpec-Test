/*
TO DO(s)
  1. Oscillation frequency. {research this, maybe it's amplitude?}
  2. Number of cycles (Period). [done]
  3. Initial delay.
  4. Data window size.
  5. Sampling frequency (optional). [done]

Recap of wave physics:
  Y (position) and t (time) are the axis.
  A is Amplitude, also known as maximum distance from Y0. Y is always lower or equal than A but never higher.
  T is period. A period is the t between two points with maximum A.
  W is Angular Velocity, calculated from 2PI/T.
  Oscillation Frequency is the time it takes to reach from Y T0 to A twice (one positive, one negative) and return back to its original Y value.
  Initial Delay is the difference between Y0 and Y at T0.
  Sampling Frequency is the number of samples per second that the machine captures (also known as FPS).
*/
import React, { Component } from 'react';
import './App.css';

var interval;
var wave = [];
var cycle = false;
var yx = 0;
class App extends Component {
  state = {
    dataWindowSize: {
      x: 1000,
      y: 500
    },
    samplingFrequency: 0.1,
    initialDelay: 200,
    period: 100,
    oscillationFrequency: 1,
    amplitude: 125,
    y: 0,
    sample: 0,
    start: false,
  }
  
  componentDidMount() {
    this.xyAxis();
  }

  xyAxis = () => {
    var canvas = document.getElementById("myCanvas");
    var xAxis = canvas.getContext("2d");
    xAxis.beginPath();
    xAxis.moveTo(0, canvas.height / 2);
    xAxis.lineTo(canvas.width, canvas.height / 2);
    xAxis.strokeStyle = "red";
    xAxis.stroke();
    var yAxis = canvas.getContext("2d");
    yAxis.beginPath();
    yAxis.moveTo(0, 0);
    yAxis.lineTo(0, canvas.height);
    yAxis.strokeStyle = "blue";
    yAxis.stroke();
  }

  waveFormula = (yx) => {
    var amplitude = this.state.amplitude;
    var period = this.state.period;
    var canvas = document.getElementById('myCanvas');
    return (canvas.height/2 - (amplitude * Math.sin(((2 * Math.PI) / period) * yx)));
  }

  waveSampling = (x, y, canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.xyAxis();
    ctx.beginPath();
    ctx.moveTo(x, y);
    while (x <= canvas.width) {
      y = this.waveFormula(yx);
      wave.push({x: yx, y: y});
      if (y === (canvas.height/2) && yx !== 0) {
        wave.push({ cycle: true });
      }
      ctx.lineTo(x, y);
      x++;
      yx++;
    }
    this.setState({ y: y });
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  waveSample = () => {
    if (this.state.start === true) {
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      var x = 0;
      var y = this.state.y;
      if (y === 0) {
        y = canvas.height / 2;
      }
      var initialDelay = this.state.initialDelay;
      var sample = this.state.sample;
      if (initialDelay !== 0 && sample === 0) {
        x = initialDelay;
        this.setState({ sample: 1 });
      }
      this.waveSampling(x, y, canvas, ctx);
    } else {
      clearInterval(interval);
    }
  }

  start = () => {
    this.setState({ start: true }, () => {
      interval = setInterval(this.waveSample, this.state.samplingFrequency * 1000);
    });
  }

  stop = () => {
    wave = [];
    cycle = false;
    this.setState({
      start: false,
      y: 0,
      sample: 0,
    }, () => {
      var canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.xyAxis();
    });
  }

  onMeasureChange = () => {
    this.setState({
      initialDelay: document.getElementById('initialDelay').value,
      samplingFrequency: document.getElementById('samplingFrequency').value,
      amplitude: document.getElementById('amplitude').value * 2,
      dataWindowSize: {
        x: document.getElementById('dataWindowsSizeX').value * 1,
        y: document.getElementById('dataWindowsSizeY').value * 2,
      },
    }, () => {
      this.xyAxis();
    });
  }

  onPeriodChange = () => {
    this.setState({
      oscillationFrequency: 1 / document.getElementById('period').value,
      period: document.getElementById('period').value
    })
  }

  onFrequencyChange = () => {
    this.setState({
      oscillationFrequency: document.getElementById('oscillationFrequency').value,
      period: 1 / document.getElementById('oscillationFrequency').value
    })
  }

  render() {
    const { samplingFrequency, dataWindowSize, oscillationFrequency, period, initialDelay, amplitude } = this.state
    return (
      <div className="App">
        <p>
          <span style={{marginRight: 50}}>Oscillation Frequency (in Hz)</span>
          <input className="input" id="oscillationFrequency" type="number" value={oscillationFrequency} min="1" onChange={this.onFrequencyChange}/>
        </p>
        <p>
          <span style={{marginRight: 10}}>Period / Distance between Max Amplitudes (in seconds)</span>
          <input className="input" id="period" type="number" value={period} min="1" onChange={this.onPeriodChange }/>
        </p>
        <p>
          <span style={{marginRight: 95}}>Amplitude (in centimeters)</span>
          <input className="input" id="amplitude" type="number" value={amplitude / 2} min="0" onChange={this.onMeasureChange }/>
        </p>
        <p>
          <span style={{marginRight: 95}}>Initial Delay (in seconds)</span>
          <input className="input" id="initialDelay" type="number" value={initialDelay} min="0" onChange={this.onMeasureChange }/>
        </p>
        <p>
          <span style={{marginRight: 30}}>Sampling Frequency (in seconds)</span>
          <input className="input" id="samplingFrequency" type="number" value={samplingFrequency} min="0" onChange={this.onMeasureChange }/>
        </p>
        <p>
          <span style={{marginRight: 150}}>X-axis (in milliseconds)</span>
          <input className="input" id="dataWindowsSizeX" type="number" value={dataWindowSize.x} min="0" onChange={this.onMeasureChange }/>
        </p>
        <p>
          <span style={{marginRight: 150}}>Y-axis (in centimeters)</span>
          <input className="input" id="dataWindowsSizeY" type="number" value={dataWindowSize.y / 2} min="0" onChange={this.onMeasureChange }/>
        </p>
        <p>
          <button style={{marginRight: 10}} onClick={this.start}>Start</button>
          <button onClick={this.stop}>Stop</button>
        </p>
        <canvas id="myCanvas" width={dataWindowSize.x} height={dataWindowSize.y}></canvas>
      </div>
    );
  }
}

export default App;

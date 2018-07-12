/*
TO DO(s)
  1. Oscillation frequency. [done]
  2. Number of cycles (Period). [done]
  3. Initial delay. [done]
  4. Data window size. [done]
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
var yx = 0;

class App extends Component {
  state = {
    dataWindowSize: {
      x: 1,
      y: 1
    },
    samplingFrequency: 1,
    initialDelay: 0.125,
    period: 0.75,
    oscillationFrequency: 2,
    amplitude: 0.25,
    y: 0,
    sample: 0,
  }
  
  componentDidMount() {
    this.xyAxis();
  }

  xyAxis = () => {
    var canvas = document.getElementById("myCanvas");
    var xAxis = canvas.getContext("2d");
    var yAxis = canvas.getContext("2d");

    xAxis.beginPath();
    xAxis.moveTo(0, canvas.height / 2);
    xAxis.lineTo(canvas.width, canvas.height / 2);
    xAxis.strokeStyle = "red";
    xAxis.stroke();

    yAxis.beginPath();
    yAxis.moveTo(0, 0);
    yAxis.lineTo(0, canvas.height);
    yAxis.strokeStyle = "blue";
    yAxis.stroke();
  }

  waveFormula = (yx, canvas) => {
    var amplitude = this.state.amplitude;
    var period = this.state.period;

    if (canvas.height > this.state.dataWindowSize.y) amplitude = (amplitude * (canvas.height / this.state.dataWindowSize.y))/2;
    else if (canvas.height < this.state.dataWindowSize.y) amplitude = (amplitude * (this.state.dataWindowSize.y / canvas.height))/2;

    if (canvas.width > this.state.dataWindowSize.x) period = period * (canvas.width / this.state.dataWindowSize.x);
    else if (canvas.width < this.state.dataWindowSize.x) period = period * (this.state.dataWindowSize.x / canvas.width);

    return (amplitude * Math.sin(((2 * Math.PI) / period) * yx));
  }

  waveSampling = (x, y, canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.xyAxis();
    ctx.beginPath();
    ctx.moveTo(x, y);
    while (x <= canvas.width) {
      y = canvas.height/2 - this.waveFormula(yx, canvas);
      ctx.lineTo(x, y);
      x += 1;
      yx += 1;
    }
    this.setState({ y: y });
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  waveSample = () => {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var x = 0;
    var y = this.state.y;
    var initialDelay = this.state.initialDelay;
    var sample = this.state.sample;

    if (y === 0) y = canvas.height/2;

    if (canvas.width > this.state.dataWindowSize.x) initialDelay = initialDelay * (canvas.width / this.state.dataWindowSize.x);
    else if (canvas.width < this.state.dataWindowSize.x) initialDelay = initialDelay * (this.state.dataWindowSize.x / canvas.width);

    if (initialDelay !== 0 && sample === 0) {
      x = initialDelay;
      this.setState({ sample: 1 });
    }
    
    this.waveSampling(x, y, canvas, ctx);
  }

  start = () => {
    interval = setInterval(this.waveSample, this.state.samplingFrequency * 1000);
  }

  stop = () => {
    clearInterval(interval);
    yx = 0;
    this.setState({
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
    }, () => { this.stop(); });
  }

  onPeriodChange = () => {
    this.setState({
      oscillationFrequency: 1 / document.getElementById('period').value,
      period: document.getElementById('period').value
    }, () => { this.stop(); });
  }

  onFrequencyChange = () => {
    this.setState({
      oscillationFrequency: document.getElementById('oscillationFrequency').value,
      period: 1 / document.getElementById('oscillationFrequency').value
    }, () => { this.stop(); });
  }

  render() {
    const { samplingFrequency, dataWindowSize, oscillationFrequency, period, initialDelay, amplitude } = this.state
    return (
      <div className="App">
        <div className="fields">
          <a href="https://www.innerspec.com/eu-es">
            <img src="http://materplat.org/wp-content/uploads/innerspec.png" alt="InnerSpec Logo"/>
          </a>
          <span className="title">Sine Wave Calculator</span>
          <span className="fieldTitle">Oscillation Frequency (in Hz)</span>
          <input step="0.25" className="fieldInput" id="oscillationFrequency" type="number" value={oscillationFrequency} min="0" onChange={this.onFrequencyChange}/>
          <span className="fieldTitle">Period (in seconds)</span>
          <input step="0.25" className="fieldInput" id="period" type="number" value={period} min="0" onChange={this.onPeriodChange }/>
          <span className="fieldTitle">Amplitude (in centimeters)</span>
          <input step="0.25" className="fieldInput" id="amplitude" type="number" value={amplitude / 2} min="0" onChange={this.onMeasureChange }/>
          <span className="fieldTitle">Initial Delay (in seconds)</span>
          <input step="0.25" className="fieldInput" id="initialDelay" type="number" value={initialDelay} min="0" onChange={this.onMeasureChange }/>
          <span className="fieldTitle">X-axis (in seconds)</span>
          <input step="0.25" className="fieldInput" id="dataWindowsSizeX" type="number" value={dataWindowSize.x} min="0" onChange={this.onMeasureChange }/>
          <span className="fieldTitle">Y-axis (in centimeters)</span>
          <input step="0.25" className="fieldInput" id="dataWindowsSizeY" type="number" value={dataWindowSize.y / 2} min="0" onChange={this.onMeasureChange }/>
          <span className="fieldTitle">Sampling Frequency (in seconds)</span>
          <input step="0.25" className="fieldInput" id="samplingFrequency" type="number" value={samplingFrequency} min="0" onChange={this.onMeasureChange }/>
          <button className="start-btn btn" onClick={this.start}>Start</button>
          <button className="stop-btn btn" onClick={this.stop}>Stop</button>
        </div>
        <canvas id="myCanvas" width={1000} height={500}></canvas>
      </div>
    );
  }
}

export default App;

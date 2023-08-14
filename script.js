'use strict';

console.clear();

const APP_CONFIG = {
  debug: false,
  gridDebugSize: {
    x: 10,
    y: 10 },

  fontSize: 800,
  axisHelperSize: 10 };


class App {

  constructor() {
    _.bindAll(this, 'animate', 'onResize', 'onMouseMove');

    this.time = 0;

    this.planeHeight = 50;
    this.ratio = window.innerWidth / window.innerHeight;
    this.planeWidth = this.planeHeight * this.ratio;
    //SET-UP CAMERA
    this.cameraOpts = {
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 10000,
      z: this.planeHeight };


    let fov = 2 * Math.atan(this.planeHeight / (2 * this.cameraOpts.z)) * (180 / Math.PI);

    this.camera = new THREE.PerspectiveCamera(fov, this.cameraOpts.aspect, this.cameraOpts.near, this.cameraOpts.far);
    this.camera.position.z = this.cameraOpts.z;

    //SET-UP STAGE
    this.stage = new THREE.Scene();
    this.stage.add(this.camera);

    //SET-UP RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.start();

  }

  start() {

    if (APP_CONFIG.debug) {
      this.debug();
    }

    let texture = new THREE.Texture(this.createCanvas("Electric Air Studio"));
    texture.needsUpdate = true;

    let planeGeometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight, 0, 0);
    this.uniforms = {
      texture: {
        type: 't',
        value: texture },

      time: {
        type: "f",
        value: this.time },

      mouseX: {
        type: "f",
        value: 0 },

      mouseY: {
        type: "f",
        value: 0 } };



    var vertShader = document.getElementById('vertexShader').innerHTML;
    var fragShader = document.getElementById('fragmentShader').innerHTML;

    let planeMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      wireframe: false,
      wireframeLinewidth: 2,
      transparent: true });


    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.stage.add(this.plane);

    let container = document.querySelector('.stage');
    container.appendChild(this.renderer.domElement);
    TweenMax.ticker.addEventListener('tick', this.animate);

    //ADD EVENTS LISTENER
    this.listen();
  }

  createCanvas(text) {

    this.canvas = document.createElement('canvas');
    this.canvas.height = 5000;
    this.canvas.width = this.canvas.height * this.ratio;
    let context = this.canvas.getContext('2d');

    context.beginPath();
    context.rect(0, 0, this.canvas.width, this.canvas.height);
    context.fillStyle = "#1d1d1d";
    context.fill();
    context.closePath();

    context.beginPath();
    context.font = 'Bold ' + APP_CONFIG.fontSize + 'px Avenir';
    context.fillStyle = "#8FFF00";
    let width = context.measureText(text).width;
    context.fillText(text, this.canvas.width / 2 - width / 2, this.canvas.height / 2);
    context.fill();

    return this.canvas;

  }

  debug() {
    let gridHelper = new THREE.GridHelper(APP_CONFIG.gridDebugSize.x, APP_CONFIG.gridDebugSize.y);
    this.stage.add(gridHelper);
    let axisHelper = new THREE.AxisHelper(APP_CONFIG.axisHelperSize);
    this.stage.add(axisHelper);
  }

  listen() {
    let lazyLayout = _.debounce(this.onResize, 300);
    window.addEventListener('resize', lazyLayout);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  onResize(e) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.updateProjectionMatrix();
  }

  onMouseMove(e) {
    this.mousePos = {
      x: e.clientX,
      y: e.clientY };

  }

  animate() {

    if (this.mousePos) {
      this.uniforms.mouseX.value = this.mousePos.x;
      this.uniforms.mouseY.value = window.innerHeight - this.mousePos.y;
    }

    this.renderer.render(this.stage, this.camera);
    this.uniforms.time.value += 0.1;

  }}



new App();
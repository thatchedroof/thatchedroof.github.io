"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var THREE = _interopRequireWildcard(require("./node_modules/three/build/three.module.js"));

var _OrbitControls = require("./node_modules/three/examples/jsm/controls/OrbitControls.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

init();

function init() {
  var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
  var renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 30;
  var scene = new THREE.Scene();
  var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  var material = new THREE.MeshNormalMaterial(); //const mesh = new THREE.Mesh(geometry, material);
  //scene.add(mesh);

  var gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);
  var controls = new _OrbitControls.OrbitControls(camera, renderer.domElement);
  var background = new THREE.TextureLoader().load('space.jpg');
  scene.background = background;
  var equi = new THREE.TextureLoader().load('./benequi.png');
  var planet = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({
    map: equi
  }));
  scene.add(planet);

  function animate() {
    requestAnimationFrame(animate); //mesh.rotation.x += 0.05;
    //mesh.rotation.y += 0.02;

    planet.rotation.y = systemPairs(system).map(function (input) {
      return trueAnomaly(input, i / 100);
    })[0];
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
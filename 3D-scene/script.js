import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scene = new THREE.Scene();
scene.background = new THREE.Color('gray');

const loader = new GLTFLoader();
const batman = './public/batman/scene.gltf';
const batmobile = './public/batmobile/scene.gltf';
let batmanModel;
let batmobileModel;

loader.load(batman, function (gltf) {
  batmanModel = gltf.scene;
  scene.add(batmanModel);
  addLight();
  adjustModelAndCamera();
  scene.add(camera);
  animate();
}, undefined, function (e) {
  console.error(e);
});

loader.load(batmobile, function (gltf) {
    batmobileModel = gltf.scene;
    scene.add(batmobileModel);
    addLight();
    adjustModelAndCamera();
    scene.add(camera);
    animate();
  }, undefined, function (e) {
    console.error(e);
  });

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;

function addLight() {
  const directionalLight = new THREE.DirectionalLight('0xffffff', 2); 
  const ambientLight = new THREE.AmbientLight('0xffffff', 1);
  camera.add(directionalLight);
  camera.add(ambientLight);
}

function adjustModelAndCamera() {
  const batmobileBox = new THREE.Box3().setFromObject(batmobileModel);
  const center = batmobileBox.getCenter(new THREE.Vector3());
  const batmanBox = new THREE.Box3().setFromObject(batmanModel);
  const size = batmanBox.getSize(new THREE.Vector3());
  batmanModel.scale.setScalar(1 / size.x);
  
  batmanModel.position.x += 2;
  batmanModel.rotation.y += 40;
  
  camera.position.copy(center);
  camera.position.x += 3.5;
  camera.position.y += 2;
  camera.position.z -= 3.5;
  camera.lookAt(center);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
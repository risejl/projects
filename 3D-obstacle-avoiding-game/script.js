import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

let scene, camera, renderer, player; 
let speed = 0.1;
const boxSideLength = 0.5;
const unitLength = 100;
const size = 2 * unitLength;
const divisions = 2 * unitLength;
const xBoundary = 4 - boxSideLength / 2;
const yBoundary = xBoundary / 4;
let gameOver = false;
const numOfObstacles = 50;
let obstaclesBoundingBoxes = [];
let allObjs = [];

const playBtnScreen = document.querySelector('#play-btn-screen');
const playBtn = document.querySelector('#play-btn');

const keyBtns = document.querySelectorAll('.keys-container button');


if (WebGL.isWebGLAvailable()) {
  init();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 200);

    camera.position.set(4, 4, -4);
    camera.lookAt(0, 0, 2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 0);
    scene.add(ambientLight, directionalLight);

    initBoxes();
    
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderer.render(scene, camera);
  }

  function createBoxes(x, y, z) {
    const geometry = new THREE.BoxGeometry(boxSideLength, boxSideLength, boxSideLength);
    const material = new THREE.MeshBasicMaterial({ color: 'pink' });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    allObjs.push(cube);
    scene.add(cube);
    return cube;
  }

  function createObstacle() {
    const x = THREE.MathUtils.randFloatSpread(xBoundary * 2);
    const y = THREE.MathUtils.randFloatSpread(yBoundary * 2);
    const z = THREE.MathUtils.randFloat(10, unitLength - boxSideLength);
    const obstacle = createBoxes(x, y, z);
    const boundingBox = new THREE.Box3().setFromObject(obstacle);
    obstaclesBoundingBoxes.push(boundingBox);
  }

  function detectCollisions() {
    const playerBox = new THREE.Box3().setFromObject(player);
    for (let i = 0; i < numOfObstacles + 1; i += 1) {
      if (obstaclesBoundingBoxes[i].intersectsBox(playerBox)) {
        gameOver = true;
        playBtnScreen.style.visibility = 'visiable';
        playBtn.focus();
        if (i !== numOfObstacles) {
          alert('You lose');
        } else alert('You win!');
        return;
      }
    }
  }

  function initBoxes() {
    allObjs = [];
    obstaclesBoundingBoxes = [];

    player = createBoxes(0, 0, 0);

    for (let i = 0; i < numOfObstacles; i += 1) {
      createObstacle();
    }

    const geometry = new THREE.BoxGeometry(10, 3, 1);
    const material = new THREE.MeshBasicMaterial({ color: 'green' });
    const finishLine = new THREE.Mesh(geometry, material);
    finishLine.position.set(0, 0, divisions / 2);
    allObjs.push(finishLine);
    scene.add(finishLine);

    const boundingBox = new THREE.Box3().setFromObject(finishLine);
    obstaclesBoundingBoxes.push(boundingBox);
  }

  function animate() {
    if (gameOver) return;

    player.position.z += speed;
    camera.position.z += speed;

    detectCollisions();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    const currXPos = player.position.x;
    const currYPos = player.position.y;
    if (key === 'ArrowUp') {
      if (currYPos > yBoundary) return;
      else player.position.y += speed;
    } else if (key === 'ArrowDown') {
      if (currYPos < -yBoundary) return;
      else player.position.y -= speed;
    } else if (key === 'ArrowLeft') {
      if (currXPos > xBoundary) return;
      else player.position.x += speed;
    } else if (key === 'ArrowRight') {
      if (currXPos < -xBoundary) return;
      else player.position.x -= speed;
    }
  });

  playBtn.addEventListener('click', () => {
    allObjs.forEach((obj) => scene.remove(obj));
    camera.position.set(4, 4, -4);
    camera.lookAt(0, 0, 2);
    initBoxes();
    gameOver = false;
    animate();
    playBtnScreen.style.visibility = 'hidden';
  });

  let timeoutID = 0;
  keyBtns.forEach((keyBtn) => {
    keyBtn.addEventListener('mousedown', handleKeyDown);
    keyBtn.addEventListener('touchstart', handleKeyDown);
    keyBtn.addEventListener('mouseup', () => {
      clearTimeout(timeoutID);
      timeoutID = 0;
    });
    keyBtn.addEventListener('mouseleave', () => {
      clearTimeout(timeoutID);
      timeoutID = 0;
    });
    keyBtn.addEventListener('touchend', () => {
      clearTimeout(timeoutID);
      timeoutID = 0;
    });
    keyBtn.addEventListener('touchcancel', () => {
      clearTimeout(timeoutID);
      timeoutID = 0;
    });
  });

  function handleKeyDown(e) {
    if (gameOver) return;
    const { id } = e.currentTarget;
    if (id === 'left') moveLeft();
    if (id === 'right') moveRight();
    if (id === 'up') moveUp();
    if (id === 'down') moveDown();
  }

  function moveLeft() {
    const currXPos = player.mesh.position.x;
    if (currXPos > xBoundary) return;
    player.mesh.position.x += speed;
    clearTimeout(timeoutID);
    timeoutID = setTimeout(moveLeft, 50);
  }

  function moveRight() {
    const currXPos = player.mesh.position.x;
    if (currXPos < -xBoundary) return;
    player.mesh.position.x -= speed;
    clearTimeout(timeoutID);
    timeoutID = setTimeout(moveRight, 50);
  }

  function moveUp() {
    const currXPos = player.mesh.position.y;
    if (currXPos > yBoundary) return;
    player.mesh.position.y += speed;
    clearTimeout(timeoutID);
    timeoutID = setTimeout(moveUp, 50);
  }

  function moveDown() {
    const currXPos = player.mesh.position.y;
    if (currXPos < -yBoundary) return;
    player.mesh.position.y -= speed;
    clearTimeout(timeoutID);
    timeoutID = setTimeout(moveDown, 50);
  }

} else {
  const waring = WebGL.getWebGLErrorMessage();
  document.querySelector('body').appendChild(waring);
}

import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as space from './space';
init();
function init() {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 30;
    camera.rotation.z = Math.PI;
    const scene = new THREE.Scene();
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshNormalMaterial();
    //const mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);
    const controls = new OrbitControls(camera, renderer.domElement);
    const background = new THREE.TextureLoader().load('space.jpg');
    scene.background = background;
    const equi = new THREE.TextureLoader().load('./benequi.png');
    const planet = new THREE.Mesh(new THREE.SphereGeometry(.05, 32, 32), new THREE.MeshBasicMaterial({
        map: equi
    }));
    scene.add(planet);
    const moon = new THREE.Mesh(new THREE.SphereGeometry(.02, 32, 32), new THREE.MeshBasicMaterial({
        map: equi
    }));
    scene.add(moon);
    const origin = space.orbitCoordinates(space.earthMoonSystem, 0)[0];
    const setOrigin = [origin[0], origin[1], origin[2] - 50];
    controls.target.set(...setOrigin);
    let epoch = 0;
    function animate() {
        requestAnimationFrame(animate);
        //mesh.rotation.x += 0.05;
        //mesh.rotation.y += 0.02;
        epoch += .0001;
        let orbitCoordinates = space.orbitCoordinates(space.earthMoonSystem, epoch);
        let [x, y, z] = orbitCoordinates[0];
        let [x2, y2, z2] = orbitCoordinates[1];
        planet.position.x = x;
        planet.position.y = y;
        planet.position.z = z;
        moon.position.x = x2;
        moon.position.y = y2;
        moon.position.z = z2;
        var dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(x, y, z).toArray(), 3));
        var dotMaterial = new THREE.PointsMaterial({ size: 0.1 });
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
        var dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(x2, y2, z2).toArray(), 3));
        var dotMaterial = new THREE.PointsMaterial({ size: 0.1 });
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z + 3;
        //console.log(planet.position.x, planet.position.y, r, theta);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("./node_modules/three/build/three.module.js");
const OrbitControls_js_1 = require("./node_modules/three/examples/jsm/controls/OrbitControls.js");
const dat_gui_module_1 = require("three/examples/jsm/libs/dat.gui.module");
const CubemapToEquirectangular = require("./CubeToEquirectangular/CubeToEquirectangular.js");
const space = require("./space");
const safe_units_1 = require("safe-units");
init();
function init() {
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 30;
    //camera.rotation.z = Math.PI;
    const scene = new THREE.Scene();
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshNormalMaterial();
    //const mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);
    const controls = new OrbitControls_js_1.OrbitControls(camera, renderer.domElement);
    //const background = new THREE.TextureLoader().load('space.jpg');
    //scene.background = background;
    const bequi = new THREE.TextureLoader().load('./benequi.png');
    let scalar = { s: 100 };
    const skymap = new THREE.TextureLoader().load('./skymap.jpg', () => {
        const rt = new THREE.WebGLCubeRenderTarget(skymap.image.height);
        rt.fromEquirectangularTexture(renderer, skymap);
        scene.background = rt.texture;
    });
    //console.log("funny", space.kmToAU(space.starRadius(space.earthMoonSystem.main as { mass: number; })) * scalar.s);
    const addSystemToScene = (system, scene, scalar) => {
        const bodies = system.bodyDictionary();
        const out = {};
        for (const [name, body] of Object.entries(bodies)) {
            if ('radius' in body) {
                const radius = parseInt(body.radius().in(space.astronomicalUnits).slice(0, -3));
                const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius * scalar, 32, 32), new THREE.MeshBasicMaterial({
                    map: bequi
                }));
                scene.add(sphere);
                out[name] = sphere;
            }
            else {
                // TODO: Add binary star/planet
            }
        }
        return out;
    };
    const numerifyOrbitCoordinates = (orbitCoordinates, scalar) => {
        return [
            parseFloat(orbitCoordinates[0].in(space.astronomicalUnits).slice(0, -3)) * scalar, parseFloat(orbitCoordinates[1].in(space.astronomicalUnits).slice(0, -3)) * scalar, parseFloat(orbitCoordinates[2].in(space.astronomicalUnits).slice(0, -3)) * scalar // - 50
        ];
    };
    let bodies = addSystemToScene(space.solarSystem, scene, scalar.s);
    const orbitCoordinates = space.solarSystem.orbitCoordinates();
    console.log(orbitCoordinates);
    const origin = orbitCoordinates['sun'];
    console.log(origin);
    const setOrigin = numerifyOrbitCoordinates(origin, scalar.s);
    controls.target.set(...setOrigin);
    let dotMaterial = new THREE.PointsMaterial({ size: 0.1 });
    let equi = new CubemapToEquirectangular(renderer, false);
    let cubeCamera = new THREE.CubeCamera(0.01, 100000, new THREE.WebGLCubeRenderTarget(window.innerHeight));
    const gui = new dat_gui_module_1.GUI();
    let camZ = new THREE.Vector3(0, 0, 0);
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camZ, 'z', 0, 10);
    // cameraFolder.add(scalar, 's', 100, 800).onChange(
    //     () => {
    //         let escale = space.kmToAU(ear.radius) * scalar.s;
    //         planet.scale.x = escale;
    //         planet.scale.y = escale;
    //         planet.scale.z = escale;
    //         let mscale = space.kmToAU(m.radius) * scalar.s;
    //         moon.scale.x = mscale;
    //         moon.scale.y = mscale;
    //         moon.scale.z = mscale;
    //         let sscale = space.kmToAU(s.radius()) * scalar.s;
    //         sun.scale.x = sscale;
    //         sun.scale.y = sscale;
    //         sun.scale.z = sscale;
    //         console.log('yes', escale, mscale, sscale, ear.radius, m.radius, s.radius());
    //     }
    // );
    cameraFolder.add(camera, 'zoom', 0, 10).onChange(() => {
        camera.updateProjectionMatrix();
    });
    cameraFolder.add(camera, 'fov', 0, 90).onChange(() => {
        camera.updateProjectionMatrix();
    });
    cameraFolder.open();
    let epochChange = 0.0003;
    const miscFolder = gui.addFolder('Misc');
    miscFolder.add(epochChange, 'epochChange', .0003, .0005);
    miscFolder.open();
    let epoch = safe_units_1.Measure.of(0, safe_units_1.days);
    let frames = 0;
    function animate() {
        requestAnimationFrame(animate);
        //mesh.rotation.x += 0.05;
        //mesh.rotation.y += 0.02;
        epoch = epoch.plus(safe_units_1.Measure.of(epochChange, safe_units_1.days));
        frames += 1;
        let orbitCoordinates = space.solarSystem.orbitCoordinates(epoch);
        for (const [name, body] of Object.entries(bodies)) {
            let [x, y, z] = numerifyOrbitCoordinates(orbitCoordinates[name], scalar.s);
            body.position.x = x;
            body.position.y = y;
            body.position.z = z;
            scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(x, y, z).toArray(), 3)), dotMaterial));
        }
        // camera.position.x = x;
        // camera.position.y = y;
        // camera.position.z = z + camZ.z;
        if (frames === 10000) {
            console.log('go');
            cubeCamera.position.copy(camera.position);
            cubeCamera.update(renderer, scene);
            equi.convert(cubeCamera);
        }
        //console.log(space.orbitDistance(space.systemPairs(space.earthMoonSystem)[0], epoch));
        //console.log(planet.position.x, planet.position.y, r, theta);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

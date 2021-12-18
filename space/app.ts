import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as CubemapToEquirectangular from './CubeToEquirectangular/CubeToEquirectangular.js';
import * as space from './space';

init();

function init() {

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100000);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas')!,
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

    const controls = new OrbitControls(camera, renderer.domElement);

    //const background = new THREE.TextureLoader().load('space.jpg');
    //scene.background = background;

    const bequi = new THREE.TextureLoader().load('./benequi.png');

    let scalar = { s: 100 };

    const skymap = new THREE.TextureLoader().load(
        './skymap.jpg',
        () => {
            const rt = new THREE.WebGLCubeRenderTarget(skymap.image.height);
            rt.fromEquirectangularTexture(renderer, skymap);
            scene.background = rt.texture;
        });

    const s = space.earthMoonSystem.main as { mass: number; };

    const ear = space.earthMoonSystem.orbits[0].body.main as { mass: number, radius: number; };

    const m = space.earthMoonSystem.orbits[0].body.orbits[0].body.main as { mass: number, radius: number; };

    //console.log("funny", space.kmToAU(space.starRadius(space.earthMoonSystem.main as { mass: number; })) * scalar.s);
    const sun = new THREE.Mesh(
        new THREE.SphereGeometry(space.kmToAU(space.starRadius(s)) * scalar.s, 32, 32),
        new THREE.MeshBasicMaterial({
            map: bequi
        })
    );
    scene.add(sun);

    console.log('ear', ear.radius, space.kmToAU(ear.radius) * scalar.s);
    console.log('moo', m.radius, space.kmToAU(m.radius) * scalar.s);

    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(space.kmToAU(ear.radius) * scalar.s, 32, 32),
        new THREE.MeshBasicMaterial({
            map: bequi
        })
    );
    scene.add(planet);

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(space.kmToAU(m.radius) * scalar.s, 32, 32),
        new THREE.MeshBasicMaterial({
            map: bequi
        })
    );
    scene.add(moon);

    const origin = space.orbitCoordinates(space.earthMoonSystem, 0)[0];
    const setOrigin: [number, number, number] = [
        origin[0], origin[1], origin[2]// - 50
    ];

    controls.target.set(
        ...setOrigin
    );

    let dotMaterial = new THREE.PointsMaterial({ size: 0.1 });

    let equi = new CubemapToEquirectangular(renderer, false);
    let cubeCamera = new THREE.CubeCamera(0.01, 100000, new THREE.WebGLCubeRenderTarget(window.innerHeight));

    const gui: any = new GUI();

    let camZ = new THREE.Vector3(0, 0, 0);

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camZ, 'z', 0, 10);
    cameraFolder.add(scalar, 's', 100, 800).onChange(
        () => {
            let escale = space.kmToAU(ear.radius) * scalar.s;
            planet.scale.x = escale;
            planet.scale.y = escale;
            planet.scale.z = escale;
            let mscale = space.kmToAU(m.radius) * scalar.s;
            moon.scale.x = mscale;
            moon.scale.y = mscale;
            moon.scale.z = mscale;
            let sscale = space.kmToAU(space.starRadius(s)) * scalar.s;
            sun.scale.x = sscale;
            sun.scale.y = sscale;
            sun.scale.z = sscale;
            console.log('yes', escale, mscale, sscale, ear.radius, m.radius, space.starRadius(s));
        }
    );
    cameraFolder.add(camera, 'zoom', 0, 10).onChange(
        () => {
            camera.updateProjectionMatrix();
        }
    );
    cameraFolder.add(camera, 'fov', 0, 90).onChange(
        () => {
            camera.updateProjectionMatrix();
        }
    );
    cameraFolder.open();

    let epoch = 0;
    let frames = 0;

    function animate() {

        requestAnimationFrame(animate);

        //mesh.rotation.x += 0.05;
        //mesh.rotation.y += 0.02;
        epoch += .0003;
        frames += 1;

        let orbitCoordinates = space.orbitCoordinates(space.earthMoonSystem, epoch);

        let [x, y, z] = orbitCoordinates[0].map((x) => { return x * scalar.s; });
        let [x2, y2, z2] = orbitCoordinates[1].map((x) => { return x * scalar.s; });

        planet.position.x = x;
        planet.position.y = y;
        planet.position.z = z;
        moon.position.x = x2;
        moon.position.y = y2;
        moon.position.z = z2;

        scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(x, y, z).toArray(), 3)), dotMaterial));

        scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(x2, y2, z2).toArray(), 3)), dotMaterial));

        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z + camZ.z;

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

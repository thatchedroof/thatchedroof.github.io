import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as CubemapToEquirectangular from './CubeToEquirectangular/CubeToEquirectangular.js';
import * as space from './space';
import { orbitCoordinates } from './space';
import { Measure, GenericMeasure, UnitWithSymbols, Trig, Length, Time, Mass, VolumeDensity, Dimensionless, PlaneAngle, wrapUnaryFn, kilograms, grams, meters, kilo, centi, days, seconds, degrees } from "safe-units";


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

    //console.log("funny", space.kmToAU(space.starRadius(space.earthMoonSystem.main as { mass: number; })) * scalar.s);

    const addSystemToScene = (system: space.ISystem, scene: THREE.Scene, scalar: number): { [name: string]: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>; } => {
        const bodies = system.bodyDictionary();
        const out = {};
        for (const [name, body] of Object.entries(bodies)) {
            if ('radius' in body) {
                const radius = parseInt(body.radius().in(space.astronomicalUnits).slice(0, -3));
                const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(radius * scalar, 32, 32),
                    new THREE.MeshBasicMaterial({
                        map: bequi
                    })
                );
                scene.add(sphere);
                out[name] = sphere;
            } else {
                // TODO: Add binary star/planet
            }
        }
        return out;
    };

    const numerifyOrbitCoordinates = (orbitCoordinates: [Length, Length, Length], scalar: number) => {
        return [
            parseFloat(orbitCoordinates[0].in(space.astronomicalUnits).slice(0, -3)) * scalar, parseFloat(orbitCoordinates[1].in(space.astronomicalUnits).slice(0, -3)) * scalar, parseFloat(orbitCoordinates[2].in(space.astronomicalUnits).slice(0, -3)) * scalar// - 50
        ] as [number, number, number];
    };

    let bodies = addSystemToScene(space.solarSystem, scene, scalar.s);

    const orbitCoordinates = space.solarSystem.orbitCoordinates();
    console.log(orbitCoordinates);
    const origin = orbitCoordinates['sun'];
    console.log(origin);
    const setOrigin: [number, number, number] = numerifyOrbitCoordinates(origin, scalar.s);

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

    let epochChange = 0.0003;

    const miscFolder = gui.addFolder('Misc');
    miscFolder.add(epochChange, 'epochChange', .0003, .0005);
    miscFolder.open();

    let epoch = Measure.of(0, days);
    let frames = 0;

    function animate() {

        requestAnimationFrame(animate);

        //mesh.rotation.x += 0.05;
        //mesh.rotation.y += 0.02;
        epoch = epoch.plus(Measure.of(epochChange, days));
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

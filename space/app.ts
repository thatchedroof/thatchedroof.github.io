import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from './node_modules/three/examples/jsm/controls/FlyControls.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import * as CubemapToEquirectangular from './CubeToEquirectangular/CubeToEquirectangular.js';
import * as space from './space';
import { Measure, GenericMeasure, UnitWithSymbols, Trig, Length, Time, Mass, VolumeDensity, Dimensionless, PlaneAngle, wrapUnaryFn, kilograms, grams, meters, kilo, centi, days, seconds, degrees } from "safe-units";
import { BufferGeometry } from 'three';

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

    // const controls = new OrbitControls(camera, renderer.domElement);
    let controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 100;
    controls.rollSpeed = Math.PI / 3;
    controls.autoForward = false;
    controls.dragToLook = true;

    //const background = new THREE.TextureLoader().load('space.jpg');
    //scene.background = background;

    const bequi = new THREE.TextureLoader().load('./benequi.png');

    let scalar = { s: 1000 };

    const skymap = new THREE.TextureLoader().load(
        './skymap.jpg',
        () => {
            const rt = new THREE.WebGLCubeRenderTarget(skymap.image.height);
            rt.fromEquirectangularTexture(renderer, skymap);
            scene.background = rt.texture;
        });

    let system = space.solarSystem;

    let root = 'sun';

    const convertCoordinates = (inp: [Length, Length, Length]): [number, number, number] => {
        return [
            Number(inp[0].in(space.astronomicalUnits.withSymbol(''))),
            Number(inp[1].in(space.astronomicalUnits.withSymbol(''))),
            Number(inp[2].in(space.astronomicalUnits.withSymbol('')))
        ];
    };

    function objectMap<A, B>(object: { [key: string]: A; }, fn: ([k, v]: [string, A]) => [string, B]) {
        return Object.fromEntries(Object.entries(object).map(fn));
    }

    let radii = objectMap(system.bodyDictionary(), ([k, v]) => [k, Number((v as space.IStar | space.IPlanet).radius().in(space.astronomicalUnits.withSymbol('')))] as [string, number]);

    //console.log("funny", space.kmToAU(space.starRadius(space.earthMoonSystem.main as { mass: number; })) * scalar.s);
    // const sun = new THREE.Mesh(
    //     new THREE.SphereGeometry(Number(system.getRadialBody(root).radius().in(space.astronomicalUnits.withSymbol(''))) * scalar.s, 32, 32),
    //     new THREE.MeshBasicMaterial({
    //         map: bequi,
    //         color: 0xffff77
    //     })
    // );
    // scene.add(sun);

    console.log('ear', radii.earth);
    console.log('moo', radii.moon);

    let meshDict: { [key: string]: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>; } = {};

    for (let body of system.bodies()) {
        let color = Math.floor(Math.random() * 16777215);
        if (body.name() === 'mercury')
            color = 0x1a1a1a;
        else if (body.name() === 'venus')
            color = 0xe6e6e6;
        else if (body.name() === 'earth')
            color = 0x2f6a69;
        else if (body.name() === 'mars')
            color = 0x993d00;
        else if (body.name() === 'jupiter')
            color = 0xb07f35;
        else if (body.name() === 'saturn')
            color = 0xb08f36;
        else if (body.name() === 'uranus')
            color = 0x5580aa;
        else if (body.name() === 'neptune')
            color = 0x366896;
        else if (body.name() === 'sun')
            color = 0xffff77;
        else if (body.name() === 'moon')
            color = 0x707070;
        else
            throw new Error(body.toString());
        console.log(color, body.name());
        meshDict[body.name()] = new THREE.Mesh(
            new THREE.SphereGeometry(radii[body.name()] * scalar.s * (body.name() === 'sun' ? 1 : 1000), 32, 32),
            new THREE.MeshBasicMaterial({
                map: bequi,
                color: color
            })
        );
        scene.add(meshDict[body.name()]);
    }

    const origin = system.orbitCoordinates()['earth'];
    const setOrigin: [number, number, number] = convertCoordinates([
        origin[0], origin[1], origin[2]// - 50
    ]);

    // controls.target.set(
    //     ...setOrigin
    // );

    let dotMaterial = new THREE.PointsMaterial({ size: 0.1 * 100 });

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
    //         let sscale = space.kmToAU(space.starRadius(s)) * scalar.s;
    //         sun.scale.x = sscale;
    //         sun.scale.y = sscale;
    //         sun.scale.z = sscale;
    //         console.log('yes', escale, mscale, sscale, ear.radius, m.radius, space.starRadius(s));
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

    let epochChange = .0003 * 1000 / 3;

    // const miscFolder = gui.addFolder('Misc');
    // miscFolder.add(epochChange, 'epochChange', .0003, .0005);
    // miscFolder.open();

    let epoch = Measure.of(0, days);
    let frames = 0;

    function animate() {

        requestAnimationFrame(animate);

        //mesh.rotation.x += 0.05;
        //mesh.rotation.y += 0.02;
        epoch = epoch.plus(Measure.of(epochChange, days));
        frames += 1;

        let newSystem = system.addTime(Measure.of(epoch, days));

        let orbitCoordinates = objectMap(newSystem.orbitCoordinates(), ([k, v]) => [k, convertCoordinates(v).map((x) => x * scalar.s) as [number, number, number]]);
        orbitCoordinates = { ...orbitCoordinates, sun: [0, 0, 0] };

        // let [x, y, z] = orbitCoordinates[0].map((x) => { return x * scalar.s; });
        // let [x2, y2, z2] = orbitCoordinates[1].map((x) => { return x * scalar.s; });

        // planet.position.x = x;
        // planet.position.y = y;
        // planet.position.z = z;
        // moon.position.x = x2;
        // moon.position.y = y2;
        // moon.position.z = z2;

        for (let body of system.bodies()) {
            meshDict[body.name()].position.x = orbitCoordinates[body.name()][0];
            meshDict[body.name()].position.y = orbitCoordinates[body.name()][1];
            meshDict[body.name()].position.z = orbitCoordinates[body.name()][2];

            scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(orbitCoordinates[body.name()][0], orbitCoordinates[body.name()][1], orbitCoordinates[body.name()][2]).toArray(), 3)), dotMaterial));
            console.log(body.name(), radii[body.name()], orbitCoordinates[body.name()]);
        }

        // scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(x, y, z).toArray(), 3)), dotMaterial));

        // scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new THREE.Vector3(x2, y2, z2).toArray(), 3)), dotMaterial));

        // camera.position.x = orbitCoordinates['earth'][0];
        // camera.position.y = orbitCoordinates['earth'][1];
        // camera.position.z = orbitCoordinates['earth'][2] + camZ.z;

        if (frames === 10000) {
            console.log('go');
            cubeCamera.position.copy(camera.position);
            cubeCamera.update(renderer, scene);
            equi.convert(cubeCamera);
        }

        //console.log(space.orbitDistance(space.systemPairs(space.earthMoonSystem)[0], epoch));

        //console.log(planet.position.x, planet.position.y, r, theta);
        controls.update(.01);

        renderer.render(scene, camera);

    }

    animate();

}

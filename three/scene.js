import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

/* =========================================
   VELOCITY MOTORS — 3D BUGATTI
========================================= */

/* SCENE */
const scene = new THREE.Scene();

/* CAMERA */
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 1, 5);

/* RENDERER */
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

/* CONTAINER */
const container = document.getElementById("three-container");

if (!container) {
    console.error("Three.js: #three-container not found.");
} else {
    container.appendChild(renderer.domElement);
}

/* LIGHTING */
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(
    0xffffff,
    1.5
);

fillLight.position.set(-4, 2, 3);
scene.add(fillLight);

/* =========================================
   LOAD BUGATTI
========================================= */

const loader = new GLTFLoader();

loader.load(
    "../models/bugatti-chiron.glb",

    (gltf) => {
        const car = gltf.scene;

        /* SCALE */
        car.scale.set(
            1.5,
            1.5,
            1.5
        );

        /* POSITION */
        car.position.set(
            0,
            -1,
            0
        );

        scene.add(car);

        console.log("Bugatti Chiron loaded successfully!");
    },

    (progress) => {
        if (progress.total) {
            const percent =
                (progress.loaded / progress.total) * 100;

            console.log(
                `Loading Bugatti: ${percent.toFixed(0)}%`
            );
        }
    },

    (error) => {
        console.error(
            "Failed to load Bugatti model:",
            error
        );
    }
);

/* =========================================
   ANIMATION
========================================= */

function animate() {
    requestAnimationFrame(animate);

    renderer.render(
        scene,
        camera
    );
}

animate();

/* =========================================
   RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {
        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );
    }
);
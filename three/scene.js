import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
console.log("NEW SCENE.JS IS RUNNING");

/* =========================================
   VELOCITY MOTORS
   BUGATTI CHIRON 3D SHOWROOM
========================================= */

const container = document.getElementById("three-container");

if (!container) {
    throw new Error("#three-container not found");
}

/* =========================================
   SCENE
========================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050607);

scene.fog = new THREE.FogExp2(
    0x050607,
    0.025
);

/* =========================================
   CAMERA
========================================= */

const camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(0, 1.15, 7);

/* =========================================
   RENDERER
========================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.05;

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement);

/* =========================================
   SHOWROOM FLOOR
========================================= */

const floorGeometry =
    new THREE.PlaneGeometry(30, 30);

const floorMaterial =
    new THREE.MeshPhysicalMaterial({
        color: 0x08090a,
        roughness: 0.18,
        metalness: 0.72,
        clearcoat: 0.35,
        clearcoatRoughness: 0.12
    });

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

floor.rotation.x = -Math.PI / 2;

floor.position.y = -1.08;

floor.receiveShadow = true;

scene.add(floor);

/* =========================================
   SHOWROOM PLATFORM
========================================= */

const platformGeometry =
    new THREE.CylinderGeometry(
        5.2,
        5.2,
        0.12,
        96
    );

const platformMaterial =
    new THREE.MeshPhysicalMaterial({
        color: 0x111315,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 0.5
    });

const platform = new THREE.Mesh(
    platformGeometry,
    platformMaterial
);

platform.position.y = -1.01;

platform.receiveShadow = true;

scene.add(platform);

/* =========================================
   PLATFORM RING
========================================= */

const ringGeometry =
    new THREE.RingGeometry(
        4.75,
        4.82,
        128
    );

const ringMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x4d5964,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide
    });

const ring = new THREE.Mesh(
    ringGeometry,
    ringMaterial
);

ring.rotation.x = -Math.PI / 2;

ring.position.y = -0.94;

scene.add(ring);
/* TEMPORARY FIX
   Hide surfaces that are covering the car
*/

floor.visible = false;
platform.visible = false;
ring.visible = false;

/* =========================================
   LIGHTING
========================================= */

const ambient =
    new THREE.AmbientLight(
        0xffffff,
        0.7
    );

scene.add(ambient);

/* Main key light */

const keyLight =
    new THREE.DirectionalLight(
        0xffffff,
        4
    );

keyLight.position.set(4, 7, 5);

keyLight.castShadow = true;

keyLight.shadow.mapSize.width = 2048;

keyLight.shadow.mapSize.height = 2048;

keyLight.shadow.camera.near = 0.5;

keyLight.shadow.camera.far = 20;

scene.add(keyLight);

/* Blue side light */

const blueLight =
    new THREE.PointLight(
        0x7c9bbd,
        18,
        12,
        2
    );

blueLight.position.set(-5, 3, 2);

scene.add(blueLight);

/* Warm rim light */

const warmLight =
    new THREE.PointLight(
        0xffd9a0,
        10,
        10,
        2
    );

warmLight.position.set(4, 2.5, -5);

scene.add(warmLight);

/* Front light */

const frontLight =
    new THREE.DirectionalLight(
        0xffffff,
        1.8
    );

frontLight.position.set(0, 3, 8);

scene.add(frontLight);

/* Rear rim light */

const rimLight =
    new THREE.DirectionalLight(
        0xc5d7ed,
        2.5
    );

rimLight.position.set(0, 5, -8);

scene.add(rimLight);

/* Ceiling light */

const ceilingGeometry =
    new THREE.BoxGeometry(
        9,
        0.04,
        0.35
    );

const ceilingMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xdfe8f0
    });

const ceilingLight = new THREE.Mesh(
    ceilingGeometry,
    ceilingMaterial
);

ceilingLight.position.set(0, 5, -1);

scene.add(ceilingLight);

/* =========================================
   BUGATTI CHIRON MODEL
========================================= */

let car = null;

const loader = new GLTFLoader();

/*
   scene.js is inside /three.
   Bugatti model is inside /models.
*/

const MODEL_URL =
    new URL(
        "../models/bugatti-chiron.glb",
        import.meta.url
    ).href;

/* Load the GLB */

loader.load(
    MODEL_URL,

    (gltf) => {

        car = gltf.scene;

        /* ---------------------------------
           FIND MODEL DIMENSIONS
        --------------------------------- */

        const box =
            new THREE.Box3()
                .setFromObject(car);

        const size =
            box.getSize(
                new THREE.Vector3()
            );

        const center =
            box.getCenter(
                new THREE.Vector3()
            );

        /* ---------------------------------
           CENTER THE MODEL
        --------------------------------- */

        car.position.sub(center);

        /* ---------------------------------
           SCALE THE MODEL
        --------------------------------- */

        const maxDimension =
            Math.max(
                size.x,
                size.y,
                size.z
            );

        const targetSize = 4;

        const scale =
            targetSize / maxDimension;

        car.scale.setScalar(scale);

        /* =========================================
   BUGATTI POSITION - NO PLATFORM
========================================= */

/* Keep the car centered vertically */
car.position.y = 0;
        /* ---------------------------------
           MATERIALS AND SHADOWS
        --------------------------------- */

        car.traverse((object) => {

            if (!object.isMesh) {
                return;
            }

            object.castShadow = true;

            object.receiveShadow = true;

            if (object.material) {

                object.material.needsUpdate = true;

                if (
                    "envMapIntensity"
                    in object.material
                ) {

                    object.material.envMapIntensity = 1.5;

                }

            }

        });

        /* Add car to the scene */

        scene.add(car);

        console.log(
            "Bugatti Chiron loaded successfully!"
        );

    },

    (progress) => {

        if (progress.total > 0) {

            const percent =
                (progress.loaded /
                    progress.total) * 100;

            console.log(
                `Loading Bugatti: ${percent.toFixed(0)}%`
            );

        }

    },

    (error) => {

        console.error(
            "Bugatti GLB failed to load:",
            error
        );

    }
);

/* =========================================
   INTERACTION
========================================= */

let isDragging = false;

let previousX = 0;

let previousY = 0;

let targetRotationY = 0;

let targetRotationX = 0;

let currentRotationY = 0;

let currentRotationX = 0;

let targetZoom = 7;

let lastInteraction =
    performance.now();

/* Pointer down */

container.addEventListener(
    "pointerdown",
    (event) => {

        isDragging = true;

        previousX = event.clientX;

        previousY = event.clientY;

        lastInteraction =
            performance.now();

        container.setPointerCapture(
            event.pointerId
        );

        renderer.domElement.style.cursor =
            "grabbing";

    }
);

/* Pointer move */

container.addEventListener(
    "pointermove",
    (event) => {

        if (!isDragging || !car) {
            return;
        }

        const deltaX =
            event.clientX - previousX;

        const deltaY =
            event.clientY - previousY;

        previousX = event.clientX;

        previousY = event.clientY;

        targetRotationY +=
            deltaX * 0.032;

        targetRotationX +=
            deltaY * 0.030;

        targetRotationX =
            THREE.MathUtils.clamp(
                targetRotationX,
                -0.3,
                0.3
            );

        lastInteraction =
            performance.now();

    }
);

/* Pointer up */

container.addEventListener(
    "pointerup",
    (event) => {

        isDragging = false;

        if (
            container.hasPointerCapture(
                event.pointerId
            )
        ) {

            container.releasePointerCapture(
                event.pointerId
            );

        }

        renderer.domElement.style.cursor =
            "grab";

    }
);

/* Pointer cancel */

container.addEventListener(
    "pointercancel",
    () => {

        isDragging = false;

        renderer.domElement.style.cursor =
            "grab";

    }
);

/* =========================================
   ZOOM
========================================= */

container.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();

        targetZoom +=
            event.deltaY * 0.005;

        targetZoom =
            THREE.MathUtils.clamp(
                targetZoom,
                4.5,
                10
            );

    },
    {
        passive: false
    }
);

/* =========================================
   ANIMATION
========================================= */

function animate() {

    requestAnimationFrame(animate);

    if (car) {

        currentRotationY +=
            (
                targetRotationY -
                currentRotationY
            ) * 0.08;

        currentRotationX +=
            (
                targetRotationX -
                currentRotationX
            ) * 0.08;

        car.rotation.y =
            currentRotationY;

        car.rotation.x =
            currentRotationX;

        /* Automatic idle rotation */

        const idleTime =
            performance.now() -
            lastInteraction;

        if (
            !isDragging &&
            idleTime > 2000
        ) {

            targetRotationY += 0.0012;

        }

    }

    /* Smooth camera zoom */

    camera.position.z +=
        (
            targetZoom -
            camera.position.z
        ) * 0.08;

    renderer.render(
        scene,
        camera
    );

}

animate();

/* =========================================
   RESPONSIVE RESIZE
========================================= */

function resizeRenderer() {

    const width =
        container.clientWidth;

    const height =
        container.clientHeight;

    if (!width || !height) {
        return;
    }

    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

}

window.addEventListener(
    "resize",
    resizeRenderer
);

resizeRenderer();

renderer.domElement.style.cursor =
    "grab";
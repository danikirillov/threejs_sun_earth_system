import "./styles.css";
import * as THREE from "three.js";

function main() {
  const canvas = document.getElementById("c");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 40;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.set(0, 50, 0);
  // camera.up.set(0, 0, 1);
  // camera.lookAt(0, 0, 0);doesn't work unlucky

  camera.position.z = 50;

  const scene = new THREE.Scene();

  addLight(scene);

  const objects = [];

  const radius = 1;
  const widthSegments = 24;
  const heightSegments = 24;
  const sphereGeometry = new THREE.SphereBufferGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  function add(object, where) {
    if (where === undefined || where === null) scene.add(object);
    else where.add(object);
    objects.push(object);
  }

  const solarSystem = new THREE.Object3D();
  add(solarSystem);

  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5); // увеличение солнца в 5 раз
  add(sunMesh, solarSystem);

  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  add(earthOrbit, solarSystem);

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  add(earthMesh, earthOrbit);

  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.x = 2;
  add(moonOrbit, earthOrbit);

  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222
  });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.5, 0.5, 0.5);
  add(moonMesh, moonOrbit);
  
  addAxes(objects);

  renderObjects(scene, camera, renderer, objects);
}

function addAxes(objects) {
  // objects.forEach( object => { doesn't work unlucky
  //   const axes = new THREE.AxesHelper();
  //   axes.material.depthTest = false;
  //   axes.renderOrder = 1;
  //   object.add(axes);
  // });
}

function addLight(scene) {
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.PointLight(color, intensity);
  scene.add(light);
}

function convertToSeconds(time) {
  return time * 0.001;
}

function renderObjects(scene, camera, renderer, objects) {
  function render(time) {
    time = convertToSeconds(time);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.rotation.z = time;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio; //needs to optimise rendering for hd dpi
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.heigth !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

main();

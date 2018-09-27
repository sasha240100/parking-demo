import {EffectComposer, SavePass, TexturePass, BlurPass, RenderPass} from "postprocessing";

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  shadowMap: {
    enabled: true,
    type: THREE.PCFSoftShadowMap
  }
});

renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const composer = new EffectComposer(renderer);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, // fov
  window.innerWidth / window.innerHeight,
  1, // near
  100 // far
);

const savePass = new SavePass();
const blur = new BlurPass();
const texturePass = new TexturePass(savePass.renderTarget.texture, 0.0, false);
texturePass.renderToScreen = true;

composer.addPass(new RenderPass(scene, camera));
composer.addPass(savePass);
composer.addPass(blur);
composer.addPass(texturePass);

camera.position.z = 10;

scene.add(new THREE.AmbientLight(0x666666));

let _updates = [];

const clock = new THREE.Clock();
(function animate() {
  requestAnimationFrame(animate);

  for (var i = 0; i < _updates.length; i++) {
    _updates[i]();
  }

  // renderer.render(scene, camera);
  composer.render(clock.getDelta());
})();

function addUpdate(callback) {
  _updates.push(callback);
}

export {
  scene,
  camera,
  renderer,
  composer,
  texturePass,
  addUpdate
};

import Between from 'between.js';

import {scene, texturePass, addUpdate} from './core';
import Car from './Car';
import Garage from './Garage';

function blurScreen() {
  new Between(0, 1).time(1000).on('update', v => {
    console.log(v);
    texturePass.opacitySource = 1 - v;
    texturePass.opacityDestination = v;
  }).on('start', () => {
    document.querySelector('canvas').classList.add('finished');
  })
}

(async () => {
  texturePass.opacitySource = 1;
  texturePass.opacityDestination = 0;

  await new Promise(resolve => {
    scene.background = new THREE.TextureLoader().load('./assets/images/bg3-compressor.png', texture => {
      texture.anisotropy = 4;
      texture.magFilter = texture.minFilter = THREE.NearestFilter;
      resolve();
    });
  })
  // scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
	// scene.fog = new THREE.Fog(scene.background, 1, 5000);

  const car = await new Car(scene).load;
  car.mesh.rotation.y = Math.PI / 2;
  car.mesh.scale.setScalar(0.3);
  car.mesh.position.y = -2.3;
  car.mesh.position.x = -3;
  addUpdate(car.update);

  let isGameStarted = false;
  let isGameFinished = false;

  window.addEventListener('keydown', e => {
    if (isGameFinished) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        e.preventDefault();
        car.velocity.x += 0.1;

        setTimeout(() => {
          isGameStarted = true;
        }, 1000);
        break;
      case 'KeyS':
      case 'ArrowDown':
        e.preventDefault();
        car.velocity.x -= 0.1;

        setTimeout(() => {
          isGameStarted = true;
        }, 1000);
        break;
    }
  });

  const garage = await new Garage(scene).load;
  garage.mesh.position.set(3, -2.4, 0);

  document.querySelector('canvas').classList.add('loaded');
  $('#loading').fadeOut(1000);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({color: 0xffffff})
  );

  ground.receiveShadow = true;

  ground.position.y = -2;
  ground.rotation.x = -Math.PI / 2;

  // scene.add(ground);

  const light = new THREE.SpotLight(0xffffff, 1, 8);

  light.castShadow = true;
  light.position.set(6, 3.7, 0);
  light.target.position.set(6, 0, 0);

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  light.shadow.camera.near = 1;
  light.shadow.camera.far = 10;
  light.shadow.camera.fov = 10;

  scene.add(light);
  scene.add(light.target);

  var hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add( hemiLight );

  addUpdate(() => {
    if (isGameFinished) {
      car.velocity.set(0, 0, 0);
      return;
    };

    if (
      car.mesh.position.x > garage.mesh.position.x + 0.8
      || car.mesh.position.x < -8
    ) {
      blurScreen();
      $('#fail').fadeIn(1000);
      isGameFinished = true;
    } else if (
      isGameStarted
      && car.velocity.length() <= 0.1
      && car.mesh.position.x > garage.mesh.position.x - 0.4
      && car.mesh.position.x < garage.mesh.position.x + 0.7
    ) {
      blurScreen();
      $('#success').fadeIn(1000);
      isGameFinished = true;
    }
  });
})();

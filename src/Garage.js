import FBXLoader from 'exports-loader?THREE.FBXLoader!three/examples/js/loaders/FBXLoader';

const loader = new FBXLoader();

export default class Garage {
  constructor(scene) {
    this.load = new Promise(resolve => {
      loader.load('./assets/models/sibir_garaz4.fbx', data => {
        data.traverse(obj => {
          obj.receiveShadow = true;
          // if (obj.material)
            // obj.material.depthWrite = false;
        })

        this.mesh = data;
        // this.mesh.rotation.x = Math.PI / 2;
        scene.add(this.mesh);
        resolve(this);
      })
    });
  }
}

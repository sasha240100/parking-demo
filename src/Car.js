const loader = new THREE.ObjectLoader();

export default class Car {
  static wheels = [
    '3DSMesh_16_3',
    '3DSMesh_15_3',
    '3DSMesh_14_2',
    '3DSMesh_13_2',
    '3DSMesh_12_1',
    '3DSMesh_11_1'
  ]

  constructor(scene) {
    this.wheels = [];

    this.load = new Promise(resolve => {
      loader.load('./assets/models/1967-shelby-ford-mustang.json', (data) => {
        this.mesh = data;
        scene.add(this.mesh);

        data.traverse(obj => {
          if (!obj.isLight)
            obj.castShadow = true;

          if (obj.material && obj.material.blending && typeof obj.material.blending === 'string')
            obj.material.blending = THREE[obj.material.blending];
        });

        Car.wheels.forEach(wheelName => {
          const wheel = this.mesh.getObjectByName(wheelName);

          wheel.geometry.computeBoundingBox();
          const center = wheel.geometry.boundingBox.getCenter();
          wheel.position.copy(center);
          wheel.geometry.translate(-center.x, -center.y, -center.z);

          this.wheels.push(wheel);
        });

        console.log(this.wheels);

        // console.log(this.mesh);
        resolve(this);
      });
    });

    this.velocity = new THREE.Vector3();
  }

  update = () => {
    const momentVelocity = this.velocity.clone().divideScalar(10);

    this.mesh.position.add(momentVelocity);

    for (let wheel of this.wheels) {
      wheel.rotation.x -= momentVelocity.x * 2;
    }
  }
}

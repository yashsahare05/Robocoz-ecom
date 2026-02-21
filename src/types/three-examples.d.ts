declare module "three/examples/jsm/controls/OrbitControls" {
  import { Camera, EventDispatcher, Vector3 } from "three";

  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement);
    enableDamping: boolean;
    dampingFactor: number;
    minDistance: number;
    maxDistance: number;
    target: Vector3;
    update(): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/loaders/STLLoader" {
  import { BufferGeometry, Loader, LoadingManager } from "three";

  export class STLLoader extends Loader {
    constructor(manager?: LoadingManager);
    parse(data: ArrayBuffer | string): BufferGeometry;
  }
}

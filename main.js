let camera, scene, renderer;
let mesh, controls, loader;
let bottleMesh, metalMesh, bottleMat, metalMat, bottleGroup;
let hemiLight, dirLight;
let exrBackground, exrCubeRenderTarget;
let isLoad = false;




import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './node_modules/three/examples/jsm/loaders/FBXLoader.js';

import { EXRLoader } from './node_modules/three/examples/jsm/loaders/EXRLoader.js';
import { EquirectangularToCubeGenerator } from './node_modules/three/examples/jsm/loaders/EquirectangularToCubeGenerator.js';
import { PMREMGenerator } from './node_modules/three/examples/jsm/pmrem/PMREMGenerator.js';
import { PMREMCubeUVPacker } from './node_modules/three/examples/jsm/pmrem/PMREMCubeUVPacker.js';

// let camera, scene, renderer;
// let mesh, controls, loader;
bottleGroup = new THREE.Group();


init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.z = 400;
  camera.position.set( -5.86, 7, -10 );
  camera.position.z = -10;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x454545);
  
  // LIGHTS
  
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0x676d70, 1.45 );
  // hemiLight.color.set(0xff0000);
  hemiLight.position.set( 0, 50, 0 );
  hemiLight.castShadow = true;

  scene.add( hemiLight );

  // hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );
  
  
  // DirLight
  dirLight = new THREE.DirectionalLight( 0xdddac9,  0.7 );
  dirLight.position.set( 0, 10, -8 );
  dirLight.position.multiplyScalar( 30 );
  scene.add( dirLight );
  // dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHeper );

  dirLight.castShadow = true;

  // var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

  


  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.toneMapping = THREE.LinearToneMapping;
  document.body.appendChild( renderer.domElement );

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set( -5.86, 7, -10 );
  camera.position.z = -10;
  controls.update();

  // Camera ease in and out
  controls.enablePan = false;
  // controls.enableZoom = false; 
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.enableDamping = true;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = 3;
  controls.dampingFactor = 0.07;
  controls.rotateSpeed = 0.07;

  // controls.autoRotate = true;
  // controls.autoRotateSpeed = 0.10;

  
  // camera.up =  new THREE.Vector3( 0, 1, 0 );
  // camera.lookAt(new THREE.Vector3(0,500,100));
  controls.object.position.set(-35.7, 15, -41.2);
  controls.target = new THREE.Vector3(0, 5, 0);

  // EXR
  new EXRLoader()
    .setType( THREE.FloatType )
    .load( 'resource/textures/lion/Pattern4.exr', function ( texture ) {

      texture.minFilter = THREE.NearestFilter;
      // texture.magFilter = THREE.NearestFilter;
      // texture.encoding = THREE.LinearEncoding;
      texture.encoding = THREE.sRGBEncoding;

      var cubemapGenerator = new EquirectangularToCubeGenerator( texture, { resolution: 512, type: THREE.HalfFloatType } );
      exrBackground = cubemapGenerator.renderTarget;
      var cubeMapTexture = cubemapGenerator.update( renderer );

      var pmremGenerator = new PMREMGenerator( cubeMapTexture );
      pmremGenerator.update( renderer );

      var pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
      pmremCubeUVPacker.update( renderer );

      exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

      texture.dispose();
      pmremGenerator.dispose();
      pmremCubeUVPacker.dispose();

    } );
    
  function DDD() {
    setTimeout(function(){ console.log('OKGO'); }, 3000);
  }
  
  loader = new FBXLoader();
  let textureloader = new THREE.TextureLoader();
  
  let bottleTextureMap_C = textureloader.load( 'resource/textures/lion/YWC_AlbedoTransparency.png' );
  let bottleTextureMap_NM = textureloader.load( 'resource/textures/lion/YWC_Normal.png' );
  let bottleTextureMap_RM = textureloader.load( 'resource/textures/lion/YWC_MetallicSmoothness.png' );
  bottleMat = new THREE.MeshStandardMaterial( { color: 0xffffff, 
                                                  map: bottleTextureMap_C, 
                                                  normalMap:bottleTextureMap_NM, 
                                                  roughnessMap:bottleTextureMap_RM,
                                                  roughness:1.0,
                                                  metalnessMap:bottleTextureMap_RM, 
                                                  metalness:0,
                                                  envMap:exrCubeRenderTarget,
                                                  envMapIntensity :1,
                                                } );

  metalMat = new THREE.MeshStandardMaterial( { color: 0xB48686, 
                                                  roughness:0.2,
                                                  metalness:1,
                                                  emissive:0xB48686,
                                                  emissiveIntensity : 0.5,
                                                  envMap:exrCubeRenderTarget,
                                                  envMapIntensity :1,
                                                } );


  // 

  var material = new THREE.MeshStandardMaterial( { 
                                                roughness:0.2,
                                                metalness:1,
                                                envMapIntensity: 1.0
                                                  } );
  
  let geometry = new THREE.TorusKnotBufferGeometry( 18, 8, 150, 20 );
  mesh = new THREE.Mesh( geometry, material );
  // scene.add( mesh );
  mesh.position.x = 7;
  mesh.scale.set(0.1,0.1,0.1);
                                                  
  // metalMat.envMap = exrCubeRenderTarget.texture;
  // bottleMat.envMap = exrCubeRenderTarget.texture;

  
  loader.load( './resource/models/fbx/YWC_model.fbx', function ( fbx ) {
    fbx.mixer = new THREE.AnimationMixer( fbx );
    bottleMesh = fbx.children[0];
    metalMesh = fbx.children[1];
    bottleMesh.material = bottleMat;
    metalMesh.material = metalMat;
    /*
    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    */
    // console.log(fbx);
    bottleGroup.add( fbx );
  });
  scene.add( bottleGroup );
  window.addEventListener( 'resize', onWindowResize, false );

}

function loadEnv() {
  metalMat.envMap = exrCubeRenderTarget.texture;
  bottleMat.envMap = exrCubeRenderTarget.texture;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  controls.update();
  
  render();
  // metalMesh.material.needsUpdate = true;
  // bottleMesh.material.needsUpdate = true;
  // mesh.material.needsUpdate = true;
  // scene.background = exrBackground;
  // mesh.rotation.x +=0.01;
  // 
}

function render() {
  // console.log(metalMesh);
  // metalMesh.material.needsUpdate = true;
  // bottleMesh.material.needsUpdate = true;
  renderer.render( scene, camera );
  if(metalMesh){
    isLoad = true;
    loadEnv();
    metalMesh.material.needsUpdate = true;
    bottleMesh.material.needsUpdate = true;
  }
}

export default {
  camera,
  scene,
};

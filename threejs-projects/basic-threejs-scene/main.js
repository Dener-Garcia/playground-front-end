import './style.css'
import { Scene, PerspectiveCamera, WebGLRenderer, Color, PointLight, PlaneGeometry, MeshStandardMaterial, Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/Addons.js';
import { XRButton } from 'three/examples/jsm/webxr/XRButton.js';

// create a scene
const scene = new Scene()
scene.background = new Color(0xdddddd) // cor de fundo para cena nao ficar preta

// create a renderer it a canvas where your 3d will show
const renderer = new WebGLRenderer()
renderer.xr.enabled = true; // Habilita o modo XR

renderer.setSize(window.innerWidth,
  window.innerHeight
)

// append renderer in body

const myModel = document.querySelector(".myModel")
myModel.appendChild(renderer.domElement)
document.body.appendChild(XRButton.createButton(renderer));

// create a camera

const camera = new PerspectiveCamera(
  74, // campo de visao da camera
  window.innerWidth / window.innerHeight, // default aspect radio
  0.1,
  10000 // campo de corte da visao similar ao blender
)

// custom position your camera

camera.rotate = (45 / 100) * Math.PI
camera.position.x = 500
camera.position.y = 100
camera.position.z = 2000 

// create lights for your scene

const light1 = new PointLight(0xc4c4c4, 11000000) // cor e itensidade 
light1.position.set(1600, 200, 900)
light1.castShadow = true
//Set up shadow properties for the light
light1.shadow.mapSize.height = 1512; // default
light1.shadow.mapSize.width = 1512; // default
light1.shadow.camera.near = 0.5; // default
light1.shadow.camera.far = 5000; // default
scene.add(light1) // incorpora a luz na cena 3d

const light2 = new PointLight(0xc4c4c4, 1000000) // cor e itensidade 
light2.position.set(800, 600, 400)
light2.castShadow = true
scene.add(light2) // incorpora a luz na cena 3d

const light3 = new PointLight(0xc4c4c4, 1000000) // cor e itensidade 
light3.position.set(600, 500, 300)
light3.castShadow = true
scene.add(light3) // incorpora a luz na cena 3d

// criar interacoes de drag and drop
let objects = [] // array para armazenar objetos draggable


// load your 3d model
const loader = new GLTFLoader();

// path your model
loader.load('/x500-v5.glb', 
  function ( gltf ) {
  const model = gltf.scene;
  model.scale.set(100, 100, 100); // Modifique os valores conforme necessário
	scene.add( gltf.scene );
objects.push(model) // adicionar o modelo para objetos draggable
},
undefined, 
function ( error ) {
	console.error("erro ao carregar modelo", error );
} 
);

//Create a plane that receives shadows (but does not cast them)
const planeGeometry = new PlaneGeometry( 4000, 4000 );
const planeMaterial = new MeshStandardMaterial( { color: 0xdadada, side: 2 } )
const plane = new Mesh( planeGeometry, planeMaterial );
plane.rotation.x = - Math.PI / 2
plane.position.y = -60
scene.add( plane );

// crie interacoes de orbit no modelo
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.clampiFactor = 0.24
controls.enableZoom = true

// crie interacoes de drag and drop
const dragControls = new DragControls(objects, camera, renderer.domElement);

dragControls.addEventListener('dragstart', function (event) {
  controls.enabled = false; // Desabilitar orbit control ao arrastar
  event.object.material.emissive.set(0xfafafa); // Cor de destaque ao arrastar
});

dragControls.addEventListener('dragend', function (event) {
  controls.enabled = true; // Habilitar orbit control ao soltar
  event.object.material.emissive.set(0x000000); // Remover cor de destaque
});

const animate = function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  // fica escutando o controle para atualizar o objeto na cena
  controls.update()

}

animate()
import * as THREE from './build/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { RGBELoader } from './js/RGBELoader.js';
import { GLTFLoader } from './js/GLTFLoader.js';
import { FlakesTexture } from './js/FlakesTexture.js';
import {Reflector}  from './js/Reflector.js';
import Stats from './js/stats.module.js';
import { GUI } from './js/dat.gui.module.js';
import { FlyControls } from './js/FlyControls.js';


let camera, scene, renderer;

			let cameraControls;

			let wave;

            let stats;

			let cubus;

			let cursorX,cursorY;

			let fly;

			let duck, duck2;

			let plates = [];

			const clock = new THREE.Clock();


			init();
			
            prerformMonitor();
			animate();
		

			function init() {

				
                
				document.onmousemove = function(e){
					cursorX = e.pageX;
					cursorY = e.pageY;
				}
				
				

				// renderer
				renderer = new THREE.WebGLRenderer( { alpha:false, antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				// scene
				scene = new THREE.Scene();
				let fog2 = new THREE.FogExp2(0x000000,0.001);
				scene.fog =fog2;
				

				wave = new THREE.Object3D();
				wave.rotation.set(Math.PI/2,Math.PI/.2,Math.PI/2);
				scene.add(wave);
				


				// camera
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
				camera.position.set( 0, 45, 100 );
				camera.lookAt(0,0,0);

				
				cameraControls = new OrbitControls( camera, renderer.domElement );
				cameraControls.target.set( 0, 40, 0 );
				cameraControls.maxDistance = 400;
				cameraControls.minDistance = 10;
				cameraControls.update();
				

				//FLY
				/*
				fly = new FlyControls( camera, renderer.domElement );

				fly.movementSpeed = 1500;
				fly.domElement = renderer.domElement;
				fly.rollSpeed = Math.PI / 12;
				fly.autoForward = false;
				//fly.dragToLook = false;
				*/

				
				for(let i = 0; i < 30; i+=10){
					for(let j = 0; j< 30; j+=10){
						makeMirror(10,10, new THREE.Vector3(i,j,0))
					}
				}

				

				// reflectors/mirrors

				const axesHelper = new THREE.AxesHelper( 5 );
				scene.add( axesHelper );
			

                let loader = new GLTFLoader();
                loader.load('duck.glb', function(gltf) {
                    duck = gltf.scene.children[0];
                    duck.scale.set(.6, .6, .6);
					duck.rotation.z = .4;
					duck.position.set(-33,0,-34);
                    scene.add(duck);
        
                });




				
				// lights
				const mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 );
				mainLight.position.y = 60;
				scene.add( mainLight );

				const greenLight = new THREE.PointLight( 0x00ff00, 0.25, 1000 );
				greenLight.position.set( 550, 50, 0 );
				scene.add( greenLight );

				const redLight = new THREE.PointLight( 0xff0000, 0.25, 1000 );
				redLight.position.set( - 550, 50, 0 );
				scene.add( redLight );

				const blueLight = new THREE.PointLight( 0x7f7fff, 0.25, 1000 );
				blueLight.position.set( 0, 50, 550 );
				scene.add( blueLight );

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				
				

			}

			function animate() {

				
				requestAnimationFrame( animate );
                stats.update();

				const timer = Date.now() * 0.01;

			
				//ANIMATION
				
				plates.forEach(item => {
					item.rotation.y = Math.sin(timer*0.6) * 0.03;
					item.rotation.x = Math.cos(timer*0.6) * 0.03;
				});

				if(duck != undefined){
					duck.rotation.y = Math.sin(timer*0.6) * 0.03;
					duck.rotation.z = Math.cos(timer*0.6) * 0.02;
				}
			
				renderer.render( scene, camera );
				
			}

            function prerformMonitor(){
                stats = new Stats();
                document.body.appendChild( stats.dom );
            }

			function makeMirror(width, height, position) {
				let geometry = new THREE.PlaneGeometry( width, height);
				let verticalMirror = new Reflector( geometry, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0xFCBE21
				} );
				verticalMirror.position.sub(position);
				scene.add(verticalMirror);
				wave.add(verticalMirror);
				plates.push(verticalMirror);
			}


		//	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
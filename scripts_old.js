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

			let m1, m2, m3, smallSphere;

			let groundMirror, verticalMirror, verticalMirror2, verticalMirror3, verticalMirror4;

            let stats;

			let cubus;

			let cursorX,cursorY;

			let fly;

			const clock = new THREE.Clock();


			init();
			
            prerformMonitor();
			animate();
			initGUI();

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
				m1 = new THREE.Object3D();
				m2 = new THREE.Object3D();
				m3 = new THREE.Object3D();
				scene.add(m1);
				scene.add(m2);
				scene.add(m3);


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

				

				// reflectors/mirrors

				let geometry, material;

				geometry = new THREE.CircleGeometry( 100, 64 );
				groundMirror = new Reflector( geometry, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0x777777
				} );
				groundMirror.position.y = 0.5;
				groundMirror.rotateX( - Math.PI / 2 );
				//scene.add( groundMirror );

				geometry = new THREE.PlaneGeometry( 100, 100 );
				verticalMirror = new Reflector( geometry, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0x889999
				} );
				verticalMirror.position.y = 50;
				verticalMirror.position.z = - 50;
				//scene.add( verticalMirror );

                let geometry2 = new THREE.PlaneGeometry( 150, 10);
				verticalMirror2 = new Reflector( geometry2, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0x889999
				} );

				let geometry3 = new THREE.PlaneGeometry( 150, 10);
				verticalMirror3 = new Reflector( geometry3, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0x889999
				} );

				let geometry4 = new THREE.PlaneGeometry( 150, 10);
				verticalMirror4 = new Reflector( geometry4, {
					clipBias: 0.003,
					textureWidth: window.innerWidth * window.devicePixelRatio,
					textureHeight: window.innerHeight * window.devicePixelRatio,
					color: 0x889999
				} );
				
				m1.add(verticalMirror2);
				m2.add(verticalMirror3);
				m3.add(verticalMirror4);
				//verticalMirror2.position.y = 50;
				//verticalMirror2.position.x =  -50;
                //sphereGroup.rotation.y = Math.PI/2;
				//verticalMirror2.rotation.set(Math.PI/2.6,Math.PI/2.5,0); WILL RETURN
				
				//scene.add( verticalMirror2 );


				
				verticalMirror2.position.set(23,10,0);
				verticalMirror2.rotation.set(0,-1.38,0);

				verticalMirror3.position.set(23, 20,0);
				verticalMirror3.rotation.set(0, -1.38,0);

				verticalMirror4.position.set(23, 30, 0);
				verticalMirror4.rotation.set(0, -1.38,0);
				


			

                let loader = new GLTFLoader();
                loader.load('duck.glb', function(gltf) {
                    let duck = gltf.scene.children[0];
                    duck.scale.set(0.7, 0.7, 0.7);
					duck.rotation.z = -0.9;
					duck.position.set(8,0,20);
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

				groundMirror.getRenderTarget().setSize(
					window.innerWidth * window.devicePixelRatio,
					window.innerHeight * window.devicePixelRatio
				);
				verticalMirror.getRenderTarget().setSize(
					window.innerWidth * window.devicePixelRatio,
					window.innerHeight * window.devicePixelRatio
				);

			}

			function animate() {

				
				requestAnimationFrame( animate );
                stats.update();

				const timer = Date.now() * 0.01;

			
				//ANIMATION
				
				verticalMirror2.rotation.y=(Math.cos(timer*.14)*0.03) ;
				verticalMirror3.rotation.y=(Math.cos(timer*.1)*0.03) ;
				verticalMirror4.rotation.y=(Math.cos(timer*.16)*0.03) ;

				m1.rotation.y=Math.sin(timer*.1)*0.2;
				m2.rotation.y=Math.cos(timer*.1)*0.3;
				m3.rotation.y=Math.sin(timer*.1)*0.1;

				m1.rotation.z=Math.cos(timer*.1)*0.3;
				m2.rotation.z=Math.cos(timer*.1)*0.3;
				m3.rotation.z=Math.cos(timer*.1)*0.3;
				

				const delta = clock.getDelta();
				//fly.update(delta);
			
				renderer.render( scene, camera );
				
			}

            function prerformMonitor(){
                stats = new Stats();
                document.body.appendChild( stats.dom );
            }

			function initGUI(){
				const gui = new GUI();
				const mirror1 = gui.addFolder('Mirror1');
					mirror1.add(m1.position, 'x', -60, 60, .01);
					mirror1.add(m1.position, 'y', -60, 60, .01);
					mirror1.add(m1.position, 'z', -60, 60, .01);

					mirror1.add(m1.rotation, 'x', -Math.PI*2, Math.PI, .01);
					mirror1.add(m1.rotation, 'y', -Math.PI*2, Math.PI, .01);
					mirror1.add(m1.rotation, 'z', -Math.PI*2, Math.PI, .01);
				
				const mirror2 = gui.addFolder('Mirror2');
					mirror2.add(m2.position, 'x', -60, 60, .01);
					mirror2.add(m2.position, 'y', -60, 60, .01);
					mirror2.add(m2.position, 'z', -60, 60, .01);

					mirror2.add(m2.rotation, 'x', -Math.PI*2, Math.PI*2, .01);
					mirror2.add(m2.rotation, 'y', -Math.PI*2, Math.PI*2, .01);
					mirror2.add(m2.rotation, 'z', -Math.PI*2, Math.PI*2, .01);
				
				const mirror3 = gui.addFolder('Mirror3');
					mirror3.add(m3.position, 'x', -60, 60, .01);
					mirror3.add(m3.position, 'y', -60, 60, .01);
					mirror3.add(m3.position, 'z', -60, 60, .01);

					mirror3.add(m3.rotation, 'x', -Math.PI*2, Math.PI*2, .01);
					mirror3.add(m3.rotation, 'y', -Math.PI*2, Math.PI*2, .01);
					mirror3.add(m3.rotation, 'z', -Math.PI*2, Math.PI*2, .01);	
					
				/*
					const cam = gui.addFolder('camera');
					cam.add(camera.position, 'x', -60, 60, .01);
					cam.add(camera.position, 'y', -60, 60, .01);
					cam.add(camera.position, 'z', -60, 60, .01);
					*/

					
			}
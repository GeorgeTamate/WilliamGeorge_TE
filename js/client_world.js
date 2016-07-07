//--------------------------------------------------------------//
//---------------------- GLOBAL VARIABLES ----------------------//
//--------------------------------------------------------------//

// Display Elements------------------
var container, raycaster, objects = [];
var renderer, scene, camera, controls, effect;
var zoom = 0;

// VR-Control Camera Position------------------
var cx = 0;
var cy = 3;
var cz = 0;

// Reticle------------------
var reticle;
var timebuf = 0;

// Image Loader-----------------
var loader;

// Keyboard Elements-----------------
var keyState = {};

// Scene Objects------------------
var plane;
var sky, sunSphere;
var sphere;

// City Cubes------------------
var cube;
var cubes = [];
var londonCube, parisCube, tokyoCube, turkeyCube, nycCube, sdCube;
  // city cube materials
var londonFaceMaterial = [];
var parisFaceMaterial = [];
var tokyoFaceMaterial = [];
var turkeyFaceMaterial = [];
var nycFaceMaterial = [];
var sdFaceMaterial = [];

// Players------------------
var player, playerId, moveSpeed, turnSpeed;
var playerData;
var otherPlayers = [], otherPlayersId = [];



var loadWorld = function(){
  //----------------------------------------------------------//
  //---------------------- INITIALIZING ----------------------//
  //----------------------------------------------------------//

  //Scene Elements------------------
  // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
  // Only enable it if you actually need to.
  renderer = new THREE.WebGLRenderer({antialias: false});
  renderer.setPixelRatio(Math.floor(window.devicePixelRatio));
  // Append the canvas element created by the renderer to document body element.
  document.body.appendChild(renderer.domElement);
  // Create a three.js scene.
  scene = new THREE.Scene();
  // Create a three.js camera.
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000000);
  // Apply VR headset positional data to camera.
  controls = new THREE.VRControls(camera);
  // Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  // img loader
  loader = new THREE.TextureLoader();
  // reticle
  reticle = vreticle.Reticle(camera);
  scene.add(camera);

  //Sky--------------------
  initSky();

  //Plane------------------
  var planeGeometry = new THREE.PlaneGeometry(100,100);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0x904C3E, side: THREE.DoubleSide});
  plane = new THREE.Mesh(planeGeometry,planeMaterial);
  // rotate and position the plane
  plane.rotation.x=-0.5*Math.PI;
  plane.position.x=0
  plane.position.y=-0.5
  plane.position.z=0
  // add the plane to the scene
  scene.add(plane);

  //Cubes------------------
  var geometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);

  // loading texture imgs and pushing them to arrays
  londonFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ln/ln1.jpg')} )); //LONDON
  londonFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ln/ln2.jpg')} ));
  londonFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ln/ln3.png')} ));
  londonFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ln/ln4.jpg')} ));
  londonFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ln/ln5.jpg')} ));
  londonFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ln/ln6.jpg')} ));

  parisFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/fr/fr2.png')} )); //PARIS
  parisFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/fr/fr5.jpg')} ));
  parisFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/fr/fr1.png')} ));
  parisFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/fr/fr1.png')} ));
  parisFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/fr/fr4.jpg')} ));
  parisFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/fr/fr6.png')} ));

  tokyoFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/jp/jp1.jpg')} )); //TOKYO
  tokyoFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/jp/jp2.jpg')} ));
  tokyoFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/jp/jp3.png')} ));
  tokyoFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/jp/jp4.jpg')} ));
  tokyoFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/jp/jp5.jpg')} ));
  tokyoFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/jp/jp6.png')} ));

  turkeyFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/tk/tk1.jpg')} )); //TURKEY
  turkeyFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/tk/tk2.jpg')} ));
  turkeyFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/tk/tk3.png')} ));
  turkeyFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/tk/tk4.jpg')} ));
  turkeyFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/tk/tk5.jpg')} ));
  turkeyFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/tk/tk6.jpg')} ));

  nycFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ny/ny1.jpg')} )); //NYC
  nycFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ny/ny2.jpg')} ));
  nycFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ny/ny3.png')} ));
  nycFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ny/ny4.jpg')} ));
  nycFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ny/ny5.jpg')} ));
  nycFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/ny/ny6.jpg')} ));

  sdFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/sd/sd4.png')} )); //SD
  sdFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/sd/sd7.png')} ));
  sdFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/sd/sd2.png')} ));
  sdFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/sd/sd1.png')} ));
  sdFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/sd/sd6.png')} ));
  sdFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/sd/sd5.png')} ));

  // applying textures to cubes
  cubes[0] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( londonFaceMaterial ));
  cubes[1] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( parisFaceMaterial ));
  cubes[2] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( tokyoFaceMaterial ));
  cubes[3] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( turkeyFaceMaterial ));
  cubes[4] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( nycFaceMaterial ));
  cubes[5] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( sdFaceMaterial ));

  londonCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( londonFaceMaterial ));
  parisCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( parisFaceMaterial));
  tokyoCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( tokyoFaceMaterial ));
  turkeyCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( turkeyFaceMaterial ));
  nycCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( nycFaceMaterial ));
  sdCube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( sdFaceMaterial ));


  cubes[0].ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'London'); timebuf = 0;
        flyTo('London');
      }}
  cubes[0].ongazeover = function(){}
  cubes[0].ongazeout = function(){timebuf = 0;}

  cubes[1].ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Paris'); timebuf = 0;
        flyTo('Paris');
      }}
  cubes[1].ongazeover = function(){}
  cubes[1].ongazeout = function(){timebuf = 0;}

  cubes[2].ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Tokyo'); timebuf = 0;
        flyTo('Tokyo');
      }}
  cubes[2].ongazeover = function(){}
  cubes[2].ongazeout = function(){timebuf = 0;}

  cubes[3].ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Turkey'); timebuf = 0;
        flyTo('Turkey');
      }}
  cubes[3].ongazeover = function(){}
  cubes[3].ongazeout = function(){timebuf = 0;}

  cubes[4].ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'NYC'); timebuf = 0;
        flyTo('NYC');
      }}
  cubes[4].ongazeover = function(){}
  cubes[4].ongazeout = function(){timebuf = 0;}

  cubes[5].ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Santo Domingo'); timebuf = 0;
        flyTo('SD');
      }}
  cubes[5].ongazeover = function(){}
  cubes[5].ongazeout = function(){timebuf = 0;}

  londonCube.ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'London'); timebuf = 0;
        flyTo('Home');
      }}
  londonCube.ongazeover = function(){}
  londonCube.ongazeout = function(){timebuf = 0;}

  parisCube.ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Paris'); timebuf = 0;
        flyTo('Home');
      }}
  parisCube.ongazeover = function(){}
  parisCube.ongazeout = function(){timebuf = 0;}

  tokyoCube.ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Tokyo'); timebuf = 0;
        flyTo('Home');
      }}
  tokyoCube.ongazeover = function(){}
  tokyoCube.ongazeout = function(){timebuf = 0;}

  turkeyCube.ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Turkey'); timebuf = 0;
        flyTo('Home');
      }}
  turkeyCube.ongazeover = function(){}
  turkeyCube.ongazeout = function(){timebuf = 0;}

  nycCube.ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'NYC'); timebuf = 0;
        flyTo('Home');
      }}
  nycCube.ongazeover = function(){}
  nycCube.ongazeout = function(){timebuf = 0;}

  sdCube.ongazelong = function(){
      if(timebuf < 2) {timebuf++;}
      else {
        socket.emit('lookingAtCube', 'Santo Domingo'); timebuf = 0;
        flyTo('Home');
      }}
  sdCube.ongazeover = function(){}
  sdCube.ongazeout = function(){timebuf = 0;}

  // positioning and adding cubes to the scene
  for (var i = 0; i < 6; i++) {
      // Adding cube to reticle collider list
      reticle.add_collider(cubes[i]);
      // Position cube mesh
      cubes[i].position.z = 5;
      cubes[i].position.y = 0.5;
      cubes[i].position.x = i * 3;

      // Add cube mesh to your three.js scene
      scene.add(cubes[i]);
  }

  reticle.add_collider(londonCube);
  londonCube.position.x = -50;
  londonCube.position.y = 0.5;
  londonCube.position.z = -50;
  scene.add(londonCube);

  reticle.add_collider(parisCube);
  parisCube.position.x = 0;
  parisCube.position.y = 0.5;
  parisCube.position.z = -50;
  scene.add(parisCube);

  reticle.add_collider(tokyoCube);
  tokyoCube.position.x = 50;
  tokyoCube.position.y = 0.5;
  tokyoCube.position.z = -50;
  scene.add(tokyoCube);

  reticle.add_collider(turkeyCube);
  turkeyCube.position.x = -50;
  turkeyCube.position.y = 0.5;
  turkeyCube.position.z = 50;
  scene.add(turkeyCube);

  reticle.add_collider(nycCube);
  nycCube.position.x = 0;
  nycCube.position.y = 0.5;
  nycCube.position.z = 50;
  scene.add(nycCube);

  reticle.add_collider(sdCube);
  sdCube.position.x = 50;
  sdCube.position.y = 0.5;
  sdCube.position.z = 50;
  scene.add(sdCube);



  //Events------------------------------------------
  document.addEventListener('keydown', onKeyDown, false );
  document.addEventListener('keyup', onKeyUp, false );





  function flyTo(_city) {
    switch(_city) {
      case 'Home':
        player.position.x = 0;
        player.position.z = 0;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
        break;
      case 'London':
        player.position.x = -47;
        player.position.z = -47;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
        break;
      case 'Paris':
        player.position.x = 0;
        player.position.z = -47;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
        break;
      case 'Tokyo':
        player.position.x = 47;
        player.position.z = -47;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
        break;
      case 'Turkey':
        player.position.x = -47;
        player.position.z = 47;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
        break;
      case 'NYC':
        player.position.x = 0;
        player.position.z = 47;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
        break;
      case 'SD':
        player.position.x = 47;
        player.position.z = 47;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
        break;
      default:
        break;
    }
  }

  function initSky() {

          var tiempo;
          function GetTime(latitude, longitude) {
              $.ajax({
                  url: 'http://api.geonames.org/timezoneJSON',
                  data: {lat: latitude, lng: longitude, username: 'demo'},
                  async: false,
                  success: function(Response){
                      //alert(Response.time + " in SD");
                      //alert(Response.time + " in London");
                      tiempo = Response.time[11] + Response.time[12];
                      //alert(tiempo);
                  },
                  complete: function(){}
              });
          }

          function getIlum() {
              switch(tiempo) {

                  case "12": return 0.3; break;
                  case "11": case "13": return 0.4; break;
                  case "10": case "14": return 0.5; break;
                  case "09": case "15": return 0.6; break;
                  case "08": case "16": return 0.7; break;
                  case "07": case "17": return 0.8; break;
                  case "06": case "18": return 0.9; break;
                  case "05": case "19": return 1; break;
                  case "04": case "20": return 1.1; break;
                  case "21": case "22": case "23": case '00': case "01": case "02": case "03": return 0; break;
                  default: return 1; break;
              }
          }

      // Add Sky Mesh
      sky = new THREE.Sky();
      scene.add( sky.mesh );

      // Add Sun Helper
      sunSphere = new THREE.Mesh(
                      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
                      new THREE.MeshBasicMaterial( { color: 0xffffff } )
                  );
      sunSphere.position.y = - 700000;
      sunSphere.visible = false;
      scene.add( sunSphere );

      // GUI

      //GetTime(18.4709562, -69.9336103);// SD
      //GetTime(51.5287718, -0.2416806);// London
      GetTime(51.5287718, -0.2416806);
      var ilum = getIlum();
      var effectController  = {
                  turbidity: 10,
                  reileigh: 2,
                  mieCoefficient: 0.005,
                  mieDirectionalG: 0.8,
                  luminance: ilum,
                  inclination: 0.49, // elevation / inclination
                  azimuth: 0.25, // Facing front,
                  sun:  true
              };

      var distance = 400000;

      function guiChanged() {

          var uniforms = sky.uniforms;
          uniforms.turbidity.value = effectController.turbidity;
          uniforms.reileigh.value = effectController.reileigh;
          uniforms.luminance.value = effectController.luminance;
          uniforms.mieCoefficient.value = effectController.mieCoefficient;
          uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

          var theta = Math.PI * ( effectController.inclination - 0.5 );
          var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

          sunSphere.position.x = distance * Math.cos( phi );
          sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
          sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

          sunSphere.visible = effectController.sun;

          sky.uniforms.sunPosition.value.copy( sunSphere.position );

          renderer.render( scene, camera );

      }

      guiChanged();
  }

















//---------------------------------------------------------------------//
//---------------------- ANIMATION AND RENDERING ----------------------//
//---------------------------------------------------------------------//

  // Get the VRDisplay and save it for later.
  var vrDisplay = null;
  navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
      vrDisplay = displays[0];
    }
  });

  // Request animation frame loop function
  function animate() {

    // Apply rotation to cube mesh
    for (var cube_index = 0; cube_index < 6; cube_index++) {
        cubes[cube_index].rotation.y += 0.02; //* (cube_index+1);
    }

    checkKeyStates();
    // Update VR headset position and apply to camera.
    controls.update(cx,cy,cz);
    // Render the scene.
    effect.render(scene, camera);
    //reticle_loop
    reticle.reticle_loop();
    // Keep looping.
    requestAnimationFrame(animate);
  }

  function onKeyDown( event ){

      //event = event || window.event;

      keyState[event.keyCode || event.which] = true;

  }

  function onKeyUp( event ){

      //event = event || window.event;

      keyState[event.keyCode || event.which] = false;

  }

  function onResize() {
    console.log('Resizing to %s x %s.', window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function onVRDisplayPresentChange() {
    console.log('onVRDisplayPresentChange');
    onResize();
  }

  // Kick off animation loop.
  requestAnimationFrame(animate);

  // Resize the WebGL canvas when we resize and also when we change modes.
  window.addEventListener('resize', onResize);
  window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);

  // Button click handlers.
  document.querySelector('button#fullscreen').addEventListener('click', function() {
    enterFullscreen(renderer.domElement);
  });
  document.querySelector('button#vr').addEventListener('click', function() {
    vrDisplay.requestPresent([{source: renderer.domElement}]);
  });
  document.querySelector('button#reset').addEventListener('click', function() {
    vrDisplay.resetPose();
  });

  function enterFullscreen (el) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

};




//--------------------------------------------------------------//
//---------------------- GLOBAL FUNCTIONS ----------------------//
//--------------------------------------------------------------//

var createPlayer = function(data){

    playerData = data;
    //colorPARAM = 0x1111ff;

    var cube_geometry = new THREE.BoxGeometry(data.sizeX, data.sizeY, data.sizeZ);
    var cube_material = new THREE.MeshBasicMaterial({color: data.color, wireframe: false});
    player = new THREE.Mesh(cube_geometry, cube_material);

    player.rotation.set(0,0,0);

    player.position.x = data.x;
    player.position.y = data.y;
    player.position.z = data.z;

    playerId = data.playerId;
    moveSpeed = data.speed;
    turnSpeed = data.turnSpeed;

    updateCameraPosition();

    objects.push( player );
    scene.add( player );


};

var updateCameraPosition = function(){

    /*
    camera.position.x = player.position.x + (zoom + 10) * Math.sin( player.rotation.y );
    camera.position.y = player.position.y + zoom + 7;
    camera.position.z = player.position.z + (zoom + 10) * Math.cos( player.rotation.y );
    camera.lookAt(player.position);
    */
};

var updatePlayerPosition = function(data){

    var somePlayer = playerForId(data.playerId);

    somePlayer.position.x = data.x;
    somePlayer.position.y = data.y;
    somePlayer.position.z = data.z;

    somePlayer.rotation.x = data.r_x;
    somePlayer.rotation.y = data.r_y;
    somePlayer.rotation.z = data.r_z;

};

var updatePlayerData = function(){
    playerData.x = player.position.x;
    playerData.y = player.position.y;
    playerData.z = player.position.z;

    playerData.r_x = player.rotation.x;
    playerData.r_y = player.rotation.y;
    playerData.r_z = player.rotation.z;

    // control camera update.
    cx = player.position.x;
    cy = player.position.y + 3;
    cz = player.position.z;

};

var checkKeyStates = function(){

    if (keyState[38] || keyState[87]) {
        // up arrow or 'w' - move forward
        player.position.x -= moveSpeed * Math.sin(player.rotation.y);
        player.position.z -= moveSpeed * Math.cos(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[40] || keyState[83]) {
        // down arrow or 's' - move backward
        player.position.x += moveSpeed * Math.sin(player.rotation.y);
        player.position.z += moveSpeed * Math.cos(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[37] || keyState[65]) {
        // left arrow or 'a' - rotate left
        player.rotation.y += turnSpeed;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[39] || keyState[68]) {
        // right arrow or 'd' - rotate right
        player.rotation.y -= turnSpeed;
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[81]) {
        // 'q' - strafe left
        player.position.x -= moveSpeed * Math.cos(player.rotation.y);
        player.position.z += moveSpeed * Math.sin(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }
    if (keyState[69]) {
        // 'e' - strage right
        player.position.x += moveSpeed * Math.cos(player.rotation.y);
        player.position.z -= moveSpeed * Math.sin(player.rotation.y);
        updatePlayerData();
        socket.emit('updatePosition', playerData);
    }

    // CAMERA PERSPECTIVES

    // right 4
    /*
    if(keyState[52]){
        camera.position.x = player.position.x + 10 * Math.sin( player.rotation.y + (Math.PI/2) );
        camera.position.y = player.position.y + 7;
        camera.position.z = player.position.z + 10 * Math.cos( player.rotation.y + (Math.PI/2) );
    }
    // left 3
    if(keyState[51]){
        camera.position.x = player.position.x - 10 * Math.sin( player.rotation.y + (Math.PI/2) );
        camera.position.y = player.position.y + 7;
        camera.position.z = player.position.z - 10 * Math.cos( player.rotation.y + (Math.PI/2) );
    }
    // up 1 eagle PoV
    if(keyState[49]) {
        camera.position.x = player.position.x + Math.sin( player.rotation.y );
        camera.position.y = 20;
        camera.position.z = player.position.z + Math.cos( player.rotation.y );
    }
    // down 2 backward Camera
    if(keyState[50]) {
        camera.position.x = player.position.x - 10 * Math.sin( player.rotation.y );
        camera.position.y = player.position.y + 7;
        camera.position.z = player.position.z - 10 * Math.cos( player.rotation.y );
    }
    // zoom in 5
    if(keyState[53]) {
        if (camera.position.y > 0)
            zoom -= 0.1;
    }
    // zoom out 6
    if(keyState[54]) {
        if (camera.position.y < 20)
            zoom += 0.1;
    }
    */

};

var addOtherPlayer = function(data){
    var cube_geometry = new THREE.BoxGeometry(data.sizeX, data.sizeY, data.sizeZ);
    var cube_material = new THREE.MeshBasicMaterial({color: data.color, wireframe: false});
    var otherPlayer = new THREE.Mesh(cube_geometry, cube_material);

    otherPlayer.position.x = data.x;
    otherPlayer.position.y = data.y;
    otherPlayer.position.z = data.z;

    otherPlayersId.push( data.playerId );
    otherPlayers.push( otherPlayer );
    objects.push( otherPlayer );
    scene.add( otherPlayer );

};

var removeOtherPlayer = function(data){

    scene.remove( playerForId(data.playerId) );

};

var playerForId = function(id){
    var index;
    for (var i = 0; i < otherPlayersId.length; i++){
        if (otherPlayersId[i] == id){
            index = i;
            break;
        }
    }
    return otherPlayers[index];
};

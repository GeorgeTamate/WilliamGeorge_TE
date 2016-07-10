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

// Keyboard Elements-----------------
var keyState = {};

// Scene Objects------------------
var plane;
var sky, sunSphere;
var sphere;

// City Cubes------------------
var cube;
var londonCube, parisCube, tokyoCube, turkeyCube, nycCube, sdCube;
var cube1, cube2, cube3, cube4, cube5, cube6;

// City Text------------------
//var currentCityTextMesh;
var londonText, parisText, tokyoText, turkeyText, nycText, sdText;

// Players------------------
var player, playerId, moveSpeed, turnSpeed;
var playerData;
var otherPlayers = [], otherPlayersId = [];


var clock;

// Particles
var particles = new THREE.Object3D(),
  totalParticles = 200,
  maxParticleSize = 200,
  particleRotationSpeed = 0,
  particleRotationDeg = 0,
  lastColorRange = [0, 0.3],
  currentColorRange = [0, 0.3];
  currentWeather = 'Clear';

var particleTexture, spriteMaterial;
  //weather

/*
London 51.507351, -0.127758
Paris 48.856614, 2.352222
Tokyo 35.6895, 139.6917
Turkey 38.963745, 35.243322
NYC 40.712784, -74.005941
SD 18.7357, -70.1627

white 0xEBECEC
Blue 0x1E82D6
Gray 0x929495
*/


// Works as the main() in client_world.
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
  initCityCubes();

  //Text------------------
  displayCurrentCityName();

  //Events------------------------------------------
  document.addEventListener('keydown', onKeyDown, false );
  document.addEventListener('keyup', onKeyUp, false );


  //--------------------------------------------------------------//
  //---------------------- INIT LOCAL FUNCTIONS ------------------//
  //--------------------------------------------------------------//

  function initSky() {

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

      var effectController  = {
                  turbidity: 10,
                  reileigh: 2,
                  mieCoefficient: 0.005,
                  mieDirectionalG: 0.8,
                  luminance: 0.7,
                  inclination: 0.49, // elevation / inclination
                  azimuth: 0.25, // Facing front,
                  sun:  true
              };

      var distance = 400000;

      guiChanged(effectController, distance);
  }


  function initCityCubes() {

    var cityCubeGeometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);

    var londonFaceMaterial = [];
    var parisFaceMaterial = [];
    var tokyoFaceMaterial = [];
    var turkeyFaceMaterial = [];
    var nycFaceMaterial = [];
    var sdFaceMaterial = [];
    var backFaceMaterial = [];

    // img loader
    var loader = new THREE.TextureLoader();

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

    backFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/back_box.png')} ));
    backFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/back_box.png')} ));
    backFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/back_box.png')} ));
    backFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/back_box.png')} ));
    backFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/back_box.png')} ));
    backFaceMaterial.push(new THREE.MeshBasicMaterial( { map: loader.load('img/back_box.png')} ));

    // applying textures to cubes
    londonCube = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( londonFaceMaterial ));
    parisCube = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( parisFaceMaterial));
    tokyoCube = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( tokyoFaceMaterial ));
    turkeyCube = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( turkeyFaceMaterial ));
    nycCube = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( nycFaceMaterial ));
    sdCube = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( sdFaceMaterial ));

    cube1 = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( backFaceMaterial ));
    cube2 = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( backFaceMaterial ));
    cube3 = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( backFaceMaterial ));
    cube4 = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( backFaceMaterial ));
    cube5 = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( backFaceMaterial ));
    cube6 = new THREE.Mesh(cityCubeGeometry, new THREE.MeshFaceMaterial( backFaceMaterial ));

    londonCube.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          socket.emit('lookingAtCube', 'London'); timebuf = 0;
          flyTo('London');
          callWeatherAPI(51.507351, -0.127758);
          callTimeAPI(51.507351, -0.127758);
        }}
    londonCube.ongazeover = function(){}
    londonCube.ongazeout = function(){timebuf = 0;}

    parisCube.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          socket.emit('lookingAtCube', 'Paris'); timebuf = 0;
          flyTo('Paris');
          callWeatherAPI(48.856614, 2.352222);
          callTimeAPI(48.856614, 2.352222);
        }}
    parisCube.ongazeover = function(){}
    parisCube.ongazeout = function(){timebuf = 0;}

    tokyoCube.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          socket.emit('lookingAtCube', 'Tokyo'); timebuf = 0;
          flyTo('Tokyo');
          callWeatherAPI(35.6895, 139.6917);
          callTimeAPI(35.6895, 139.6917);
        }}
    tokyoCube.ongazeover = function(){}
    tokyoCube.ongazeout = function(){timebuf = 0;}

    turkeyCube.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          socket.emit('lookingAtCube', 'Turkey'); timebuf = 0;
          flyTo('Turkey');
          callWeatherAPI(38.963745, 35.243322);
          callTimeAPI(38.963745, 35.243322);
        }}
    turkeyCube.ongazeover = function(){}
    turkeyCube.ongazeout = function(){timebuf = 0;}

    nycCube.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          socket.emit('lookingAtCube', 'NYC'); timebuf = 0;
          flyTo('NYC');
          callWeatherAPI(40.712784, -74.005941);
          callTimeAPI(40.712784, -74.005941);
        }}
    nycCube.ongazeover = function(){}
    nycCube.ongazeout = function(){timebuf = 0;}

    sdCube.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          socket.emit('lookingAtCube', 'Santo Domingo'); timebuf = 0;
          flyTo('SD');
          callWeatherAPI(18.7357, -70.1627);
          callTimeAPI(18.7357, -70.1627);
        }}
    sdCube.ongazeover = function(){}
    sdCube.ongazeout = function(){timebuf = 0;}

    cube1.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          timebuf = 0;
          flyTo('Home');
        }}
    cube1.ongazeover = function(){}
    cube1.ongazeout = function(){timebuf = 0;}

    cube2.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          timebuf = 0;
          flyTo('Home');
        }}
    cube2.ongazeover = function(){}
    cube2.ongazeout = function(){timebuf = 0;}

    cube3.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          timebuf = 0;
          flyTo('Home');
        }}
    cube3.ongazeover = function(){}
    cube3.ongazeout = function(){timebuf = 0;}

    cube4.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          timebuf = 0;
          flyTo('Home');
        }}
    cube4.ongazeover = function(){}
    cube4.ongazeout = function(){timebuf = 0;}

    cube5.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          timebuf = 0;
          flyTo('Home');
        }}
    cube5.ongazeover = function(){}
    cube5.ongazeout = function(){timebuf = 0;}

    cube6.ongazelong = function(){
        if(timebuf < 2) {timebuf++;}
        else {
          timebuf = 0;
          flyTo('Home');
        }}
    cube6.ongazeover = function(){}
    cube6.ongazeout = function(){timebuf = 0;}


    reticle.add_collider(londonCube);
    londonCube.position.x = -5;
    londonCube.position.y = 0.5;
    londonCube.position.z = -3;
    scene.add(londonCube);

    reticle.add_collider(parisCube);
    parisCube.position.x = 0;
    parisCube.position.y = 0.5;
    parisCube.position.z = -6;
    scene.add(parisCube);

    reticle.add_collider(tokyoCube);
    tokyoCube.position.x = 5;
    tokyoCube.position.y = 0.5;
    tokyoCube.position.z = -3;
    scene.add(tokyoCube);

    reticle.add_collider(turkeyCube);
    turkeyCube.position.x = 5;
    turkeyCube.position.y = 0.5;
    turkeyCube.position.z = 3;
    scene.add(turkeyCube);

    reticle.add_collider(nycCube);
    nycCube.position.x = 0;
    nycCube.position.y = 0.5;
    nycCube.position.z = 6;
    scene.add(nycCube);

    reticle.add_collider(sdCube);
    sdCube.position.x = -5;
    sdCube.position.y = 0.5;
    sdCube.position.z = 3;
    scene.add(sdCube);

    reticle.add_collider(cube1);
    cube1.position.x = -50;
    cube1.position.y = 0.5;
    cube1.position.z = -50;
    scene.add(cube1);

    reticle.add_collider(cube2);
    cube2.position.x = 0;
    cube2.position.y = 0.5;
    cube2.position.z = -50;
    scene.add(cube2);

    reticle.add_collider(cube3);
    cube3.position.x = 50;
    cube3.position.y = 0.5;
    cube3.position.z = -50;
    scene.add(cube3);

    reticle.add_collider(cube4);
    cube4.position.x = 50;
    cube4.position.y = 0.5;
    cube4.position.z = 50;
    scene.add(cube4);

    reticle.add_collider(cube5);
    cube5.position.x = 0;
    cube5.position.y = 0.5;
    cube5.position.z = 50;
    scene.add(cube5);

    reticle.add_collider(cube6);
    cube6.position.x = -50;
    cube6.position.y = 0.5;
    cube6.position.z = 50;
    scene.add(cube6);

  }

  //-------------------------------------------------------//
  //---------------------- PARTICLES ----------------------//
  //-------------------------------------------------------//



  clock = new THREE.Clock();
/*
  currentColorRange = [0.7, 0.1];// semitrans lightgray
  currentColorRange = [0, 0.01];//white
  currentColorRange = [0.69, 0.6];// tranparent violet blue
  currentColorRange = [0.6, 0.7];//bright blue
  currentColorRange = [0, 0.7];
*/


  function getURL(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
         if (xmlhttp.status == 200){
             callback(JSON.parse(xmlhttp.responseText));
         }
         else {
             console.log('We had an error, status code: ', xmlhttp.status);
         }
      }
    }
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }

    particleTexture = THREE.ImageUtils.loadTexture('textures/particle.png'),
    spriteMaterial = new THREE.SpriteMaterial({
    map: particleTexture,
    color: 0xffffff
  });

  for (var i = 0; i < totalParticles; i++) {
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(64, 64, 1.0);
    sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.75);
    sprite.position.setLength(maxParticleSize * Math.random());
    sprite.material.blending = THREE.AdditiveBlending;

    particles.add(sprite);
  }

  particles.position.y = 70;
  scene.add(particles);
  particles.visible = false;

    //Funcion que solicita las condiciones climáticas y las actualiza.
   function adjustToWeatherConditions(cityN) {
      var cityIDs = cityN;

      getURL('http://api.openweathermap.org/data/2.5/group?id=' + cityIDs + '&APPID=90dd85c8ff64da0cd1d09fbc8ae06d81', function(info) {
        cityWeather = info.list;

        lookupTimezones();
      });
  }

  //Funcion que busca las zonas horarias de los distintos lugares.
  function lookupTimezones(cityN) {
    /*
    var myUrl;
    switch (cityN) {

      //If its london----------------------------------------------------------------
      case 'London':
     myUrl= 'http://api.timezonedb.com/v2/get-time-zone?key=BGC297R9GDMR&format=json&by=zone&zone=Europe/London';
        break;

        //If its New York------------------------------------------------------------
        case 'NewYork':
       myUrl= 'http://api.timezonedb.com/v2/get-time-zone?key=BGC297R9GDMR&format=json&by=zone&zone=America/NewYork';
       break;

            //If its Santo Domingo------------------------------------------------------------
            case 'SantoDomingo':
           myUrl= 'http://api.timezonedb.com/v2/get-time-zone?key=BGC297R9GDMR&format=json&by=zone&zone=America/SantoDomingo';
           break;
                //If its Turkey------------------------------------------------------------
                case 'Turkey':
               myUrl= 'http://api.timezonedb.com/v2/get-time-zone?key=BGC297R9GDMR&format=json&by=zone&zone=Asia/Turkey';
               break;

                    //If its Paris------------------------------------------------------------
                    case 'Paris':
                   myUrl= 'http://api.timezonedb.com/v2/get-time-zone?key=BGC297R9GDMR&format=json&by=zone&zone=Europe/Paris';

                        break;
      default:break;
    }
console.log(myUrl);
    $.ajax({
      datatype: 'JSON',
      url: myUrl,
        success: function(Response){
            console.log(Response);
            var myDate = new Date(Response.timestamp*1100);
            console.log(myDate);
            var myhour= myDate.getHours();
            console.log(myhour);
          },
          complete: function(){}



           });
           */
  }

  //Funcion que aplica las condiciones climáticas a las particulas.
  function applyWeatherConditions(currentCity) {

      // TODO: Maybe display the city name here

      console.log(currentCity);

      var info = currentCity;
      particleRotationSpeed = info.wind.speed / 2; // dividing by 2 just to slow things down
      particleRotationDeg = info.wind.deg;

      var timeThere = currentCity ? currentCity.getUTCHours() : 0,
          isDay = timeThere >= 6 && timeThere <= 18;

      if (isDay) {
        switch (info.weather[0].main) {
          case 'Clouds':
            currentColorRange = [0, 0.01];
            break;
          case 'Rain':
            currentColorRange = [0.6, 0.7];
            //currentColorRange = [0.7, 0.1];
            break;
          case 'Clear':
          default:
            currentColorRange = [0.6, 0.7];
            break;
        }
      } else {
        currentColorRange = [0.69, 0.6];
      }

      if (currentCity < 5) currentCity++;
      else currentCity = 0;
      setTimeout(applyWeatherConditions, 5000);
  }

  function animateParticles() {
    var elapsedSeconds = clock.getElapsedTime(),
        particleRotationDirection = particleRotationDeg <= 180 ? -1 : 1;

    particles.rotation.y = elapsedSeconds * particleRotationSpeed * particleRotationDirection;

    // We check if the color range has changed, if so, we'll change the colours
    if (lastColorRange[0] != currentColorRange[0] && lastColorRange[1] != currentColorRange[1]) {
      for (var i = 0; i < totalParticles; i++) {
        particles.children[i].material.color.setHSL(currentColorRange[0], currentColorRange[1], (Math.random() * (0.7 - 0.2) + 0.2));
      }

      lastColorRange = currentColorRange;
    }

    if(particles.position.y >= -90) {
      particles.position.y -= 0.1;
    } else {
      particles.position.y = 70;
    }

    //requestAnimationFrame(animate); // TODO: This will add the animations to the main loop, if you have it somewhere else just call animate
    // TODO: Add update code if necessary here
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

    // Apply rotation to city cube mesh
    londonCube.rotation.y += 0.02;
    parisCube.rotation.y += 0.02;
    tokyoCube.rotation.y += 0.02;
    turkeyCube.rotation.y += 0.02;
    nycCube.rotation.y += 0.02;
    sdCube.rotation.y += 0.02;

    checkKeyStates();

    animateParticles();
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
var callTimeAPI = function(_latitud, _longitud) {
  $.ajax({
     url: 'http://api.timezonedb.com/v2/get-time-zone',
     data: {
       key:'BGC297R9GDMR',
       format:'json',
       by:'position',
       lat:_latitud,
       lng:_longitud},
     success: function(Response){

       // Create a new JavaScript Date object based on the timestamp
       // multiplied by 1000 so that the argument is in milliseconds, not seconds.
       var date = new Date(Response.timestamp * 1000);
       // Hours part from the timestamp
       var hours = date.getHours() + 4;
       // Minutes part from the timestamp
       var minutes = "0" + date.getMinutes();
       // Seconds part from the timestamp
       var seconds = "0" + date.getSeconds();

       // Do not let it go over 23
       if(hours >= 24) {hours -= 24;}
       // Will display time in 10:30:23 format
       var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

       console.log(formattedTime);

       var ilumination = getIlum(hours);
       lightIntensityChanged(ilumination);

     }
    });
};

var callWeatherAPI = function(_latitud, _longitud) {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?',
        data: {
          lat:_latitud,
          lon:_longitud,
          appid:'90dd85c8ff64da0cd1d09fbc8ae06d81'},
        success: function(Response){
          console.log(Response.weather[0].main);
          currentWeather = Response.weather[0].main;
          //
          scene.remove(particles);
          particles = new THREE.Object3D();
          var weatherpallet;
          switch(currentWeather) {
            case 'Snow': weatherpallet = 0xEBECEC; particles.visible = true; break;
            case 'Rain': weatherpallet = 0x1E82D6; particles.visible = true; break;
            case 'Clouds': weatherpallet = 0x525252; particles.visible = true; break;
            case 'Mist': weatherpallet = 0x525252; particles.visible = true; break;
            case 'Clear': weatherpallet = 0xEBECEC; particles.visible = false; break;
            default: weatherpallet = 0x1E82D6; break;
          }
          particleTexture = new THREE.ImageUtils.loadTexture('textures/particle.png'),
            spriteMaterial = new THREE.SpriteMaterial({
              map: particleTexture,
              color: weatherpallet
          });
          for (var i = 0; i < totalParticles; i++) {
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(64, 64, 1.0);
            sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.75);
            sprite.position.setLength(maxParticleSize * Math.random());
            sprite.material.blending = THREE.AdditiveBlending;

            particles.add(sprite);
          }

          particles.position.y = 70;
          scene.add(particles);
        }
    });
};

var getIlum = function(_tiempo) {
    switch(_tiempo) {
        case 12: return 0.3; break;
        case 11: case 13: return 0.4; break;
        case 10: case 14: return 0.5; break;
        case 9: case 15: return 0.6; break;
        case 8: case 16: return 0.7; break;
        case 7: case 17: return 0.8; break;
        case 6: case 18: return 0.9; break;
        case 5: case 19: return 1; break;
        case 4: case 20: return 1.1; break;
        case 21: case 22: case 23: case 0: case 1: case 2: case 3: return 0; break;
        default: return 1; break;
    }
};

var guiChanged = function(effectController, distance) {

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

};

var lightIntensityChanged = function(_ilum) {
    var effectController  = {
              turbidity: 10,
              reileigh: 2,
              mieCoefficient: 0.005,
              mieDirectionalG: 0.8,
              luminance: _ilum,
              inclination: 0.49, // elevation / inclination
              azimuth: 0.25, // Facing front,
              sun:  true
          };
    guiChanged(effectController, 400000);
};

var displayCurrentCityName = function() {
  //scene.remove(currentCityTextMesh);
  var txmat = new THREE.MeshBasicMaterial({color: 0xaaaaaa,opacity: 1});
  var txloader = new THREE.FontLoader();

    txloader.load( '../fonts/helvetiker_regular.typeface.js', function ( _font ) {

    /*
    var currentCityText = new THREE.TextGeometry('gg',
    {font: _font, size: 1,height: 0.5});
    */
    var londongeo = new THREE.TextGeometry('LONDON',
    {font: _font, size: 1,height: 0.1});
    var parisgeo = new THREE.TextGeometry('PARIS',
    {font: _font, size: 1,height: 0.1});
    var tokyogeo = new THREE.TextGeometry('TOKYO',
    {font: _font, size: 1,height: 0.1});
    var turkeygeo = new THREE.TextGeometry('TURKEY',
    {font: _font, size: 1,height: 0.1});
    var nycgeo = new THREE.TextGeometry('New York City',
    {font: _font, size: 1,height: 0.1});
    var sdgeo = new THREE.TextGeometry('Santo Domingo',
    {font: _font, size: 1,height: 0.1});
    /*
    currentCityTextMesh = new THREE.Mesh(currentCityText,txmat);
    currentCityTextMesh.position.y = 4;
    currentCityTextMesh.position.z = -12;
    currentCityTextMesh.rotation.x = 0;
    currentCityTextMesh.rotation.y = Math.PI;
    scene.add(currentCityTextMesh);
    */
    londonText = new THREE.Mesh(londongeo, txmat);
    londonText.position.x = -50;
    londonText.position.y = 2;
    londonText.position.z = -50;
    londonText.rotation.x = 0;
    londonText.rotation.y = Math.PI/4;
    scene.add(londonText);

    parisText = new THREE.Mesh(parisgeo, txmat);
    parisText.position.x = 0;
    parisText.position.y = 2;
    parisText.position.z = -50;
    parisText.rotation.x = 0;
    parisText.rotation.y = 0;
    scene.add(parisText);

    tokyoText = new THREE.Mesh(tokyogeo, txmat);
    tokyoText.position.x = 50;
    tokyoText.position.y = 2;
    tokyoText.position.z = -50;
    tokyoText.rotation.x = 0;
    tokyoText.rotation.y = 7*Math.PI/4;
    scene.add(tokyoText);

    turkeyText = new THREE.Mesh(turkeygeo, txmat);
    turkeyText.position.x = 50;
    turkeyText.position.y = 2;
    turkeyText.position.z = 50;
    turkeyText.rotation.x = 0;
    turkeyText.rotation.y = 5*Math.PI/4;
    scene.add(turkeyText);

    nycText = new THREE.Mesh(nycgeo, txmat);
    nycText.position.x = 0
    nycText.position.y = 2;
    nycText.position.z = 50;
    nycText.rotation.x = 0;
    nycText.rotation.y = Math.PI;
    scene.add(nycText);

    sdText = new THREE.Mesh(sdgeo, txmat);
    sdText.position.x = -50
    sdText.position.y = 2;
    sdText.position.z = 50;
    sdText.rotation.x = 0;
    sdText.rotation.y = 3*Math.PI/4;
    scene.add(sdText);

    } );

};

var flyTo = function(_city) {
  switch(_city) {
    case 'Home':
      player.position.x = 0;
      player.position.z = 0;
      updatePlayerData();
      socket.emit('updatePosition', playerData);
      break;
    case 'London':
      player.position.x = Math.random() * ((-41) - (-47)) + (-47);
      player.position.z = Math.random() * ((-41) - (-47)) + (-47);
      updatePlayerData();
      socket.emit('updatePosition', playerData);
      break;
    case 'Paris':
      player.position.x = Math.random() * 6;
      player.position.z = Math.random() * ((-41) - (-47)) + (-47);
      updatePlayerData();
      socket.emit('updatePosition', playerData);
      break;
    case 'Tokyo':
      player.position.x = Math.random() * (47 - 41) + 41;
      player.position.z = Math.random() * ((-41) - (-47)) + (-47);
      updatePlayerData();
      socket.emit('updatePosition', playerData);
      break;
    case 'Turkey':
      player.position.x = Math.random() * (47 - 41) + 41;
      player.position.z = Math.random() * (47 - 41) + 41;
      updatePlayerData();
      socket.emit('updatePosition', playerData);
      break;
    case 'NYC':
      player.position.x = Math.random() * 6;
      player.position.z = Math.random() * (47 - 41) + 41;
      updatePlayerData();
      socket.emit('updatePosition', playerData);
      break;
    case 'SD':
      player.position.x = Math.random() * ((-41) - (-47)) + (-47);
      player.position.z = Math.random() * (47 - 41) + 41;
      updatePlayerData();
      socket.emit('updatePosition', playerData);
      break;
    default:
      break;
  }
};

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

    //position of control camera
    cx = player.position.x;
    cy = player.position.y + 3;
    cz = player.position.z;

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

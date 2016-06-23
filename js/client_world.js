var tiempo, ilum;

function GetTime(latitude, longitude) {
  $.ajax({
    url: 'http://api.geonames.org/timezoneJSON',
      data: {lat: latitude, lng: longitude, username: 'demo'},
    async: false,
      success: function(Response){
      alert(Response.time + " in SD");
      alert(Response.time + " in London");
      tiempo = Response.time[11].concat(Response.time[12]);
      alert(tiempo);
      //alert(tiempo);
      ilum = getIlum();

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

var container, scene, camera, renderer, raycaster, objects = [];
var keyState = {};
var sphere;

var sky, sunSphere;

var sky, sunSphere;
var player, playerId, moveSpeed, turnSpeed;
var playerData;
var otherPlayers = [], otherPlayersId = [];

var zoom = 0;

var loadWorld = function(){

    init();
    animate();
    function include(file)
    {

      var script  = document.createElement('script');
      script.src  = file;
      script.type = 'text/javascript';
      script.defer = true;

      document.getElementsByTagName('head').item(0).appendChild(script);



    function skyInit(){

      // Add Sky Mesh
      sky = new THREE.Sky();
      scene.add( sky.mesh );
      //var skyshade = require('public/js/SkyShader.js');

      // Add Sun Helper
      sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 20000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
      );
      sunSphere.position.y = - 700000;
      sunSphere.visible = false;
      scene.add( sunSphere );

      /// GUI

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


    function init(){

        //Setup------------------------------------------
        container = document.getElementById('container');

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 20000000);
        camera.position.z = 5;
        camera.lookAt( new THREE.Vector3(0,0,0));

        renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

        raycaster = new THREE.Raycaster();
        //Add Objects To the Scene HERE-------------------

        //Sphere------------------
        var sphere_geometry = new THREE.SphereGeometry(1);
        var sphere_material = new THREE.MeshNormalMaterial();
        sphere = new THREE.Mesh( sphere_geometry, sphere_material );

        scene.add( sphere );
        objects.push( sphere ); //if you are interested in detecting an intersection with this sphere


        skyInit();

        //Events------------------------------------------
        document.addEventListener('click', onMouseClick, false );
        document.addEventListener('mousedown', onMouseDown, false);
        document.addEventListener('mouseup', onMouseUp, false);
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseout', onMouseOut, false);
        document.addEventListener('keydown', onKeyDown, false );
        document.addEventListener('keyup', onKeyUp, false );

        document.addEventListener('key1', onKey1, false );
        document.addEventListener('key2', onKey2, false );
        document.addEventListener('key3', onKey3, false );
        document.addEventListener('key4', onKey4, false );
        document.addEventListener('key5', onKey5, false );
        document.addEventListener('key6', onKey6, false );

        window.addEventListener( 'resize', onWindowResize, false );

        //Final touches-----------------------------------
        container.appendChild( renderer.domElement );
        document.body.appendChild( container );


    }


    function animate(){
        requestAnimationFrame( animate );
        render();
    }
    function render(){

        if ( player ){

            updateCameraPosition();

            checkKeyStates();

            camera.lookAt( player.position );
        }
        //Render Scene---------------------------------------
        renderer.clear();
        renderer.render( scene , camera );
    }

    function onMouseClick(){
        intersects = calculateIntersects( event );

        if ( intersects.length > 0 ){
            //If object is intersected by mouse pointer, do something
            if (intersects[0].object == sphere){
                alert("This is a sphere!");
            }
        }
    }
    function onMouseDown(){

    }
    function onMouseUp(){

    }
    function onMouseMove(){

    }
    function onMouseOut(){

    }
    function onKeyDown( event ){

        //event = event || window.event;

        keyState[event.keyCode || event.which] = true;

    }

    function onKeyUp( event ){

        //event = event || window.event;

        keyState[event.keyCode || event.which] = false;

    }


    function onKey1 ( event ){ keyState[event.keyCode || event.which] = true;}
    function onKey2 ( event ){ keyState[event.keyCode || event.which] = true;}
    function onKey3 ( event ){ keyState[event.keyCode || event.which] = true;}
    function onKey4 ( event ){ keyState[event.keyCode || event.which] = true;}
    function onKey5 ( event ){ keyState[event.keyCode || event.which] = true;}
    function onKey6 ( event ){ keyState[event.keyCode || event.which] = true;}


    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }
    function calculateIntersects( event ){

        //Determine objects intersected by raycaster
        event.preventDefault();

        var vector = new THREE.Vector3();
        vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
        vector.unproject( camera );

        raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( objects );

        return intersects;
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

    playerId = data.playerId;
    moveSpeed = data.speed;
    turnSpeed = data.turnSpeed;

    updateCameraPosition();

    objects.push( player );
    scene.add( player );

    camera.lookAt( player.position );
};

var updateCameraPosition = function(){

    camera.position.x = player.position.x + (zoom + 10) * Math.sin( player.rotation.y );
    camera.position.y = player.position.y + zoom + 7;
    camera.position.z = player.position.z + (zoom + 10) * Math.cos( player.rotation.y );

    camera.lookAt(player.position);
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

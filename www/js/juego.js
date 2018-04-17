var app={
  inicio: function(){
    DIAMETRO_pacman = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = 'FFE0B2';
      game.load.image('pacman', 'assets/pacman.png');
      game.load.image('objetivo1', 'assets/objetivo1.png');
      game.load.image('objetivo2', 'assets/objetivo2.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
      
      objetivo1 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo1');
      objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
      pacman = game.add.sprite(app.inicioX(), app.inicioY(), 'pacman');
      
      game.physics.arcade.enable(pacman);
      game.physics.arcade.enable(objetivo1);
      game.physics.arcade.enable(objetivo2);

      pacman.body.collideWorldBounds = true;
      pacman.body.onWorldBounds = new Phaser.Signal();
      pacman.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      pacman.body.velocity.y = (velocidadY * factorDificultad);
      pacman.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(pacman, objetivo1, app.incrementaPuntuacion, null, this);
      game.physics.arcade.overlap(pacman, objetivo2, app.incrementaPuntuacion, null, this);

      var colores = [ "#FFE0B2",  // Color por defecto
                "#FFCC80",
                "#FFB74D",  // Los colores van oscureciendo
                "#FFA726",
                "#FF9800",
                "#FB8C00",
                "#F57C00",
                "#EF6C00",
                "#E65100",
                "#000000" ];
      if(dificultad<0) game.stage.backgroundColor = colores[0];
      if(dificultad>9) game.stage.backgroundColor = colores[9];
      

       /** Si la bola está colisionando con los límites del mundo del juego **/
      if (pacman.body.checkWorldBounds()) {
        game.stage.backgroundColor = "#ff0000"; // Entonces pone un fondo rojo
      } else {
        game.stage.backgroundColor = colores[dificultad]; // De lo contrario pone el fondo naranja
      }
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
    if(puntuacion<=0) dificultad=0;
  },

  incrementaPuntuacion: function(pacman, ob){
    if(ob==objetivo1) puntuacion = puntuacion+1;
    if(ob==objetivo2) puntuacion = puntuacion+5;

    scoreText.text = puntuacion;

    ob.body.x = app.inicioX();
    ob.body.y = app.inicioY();

    if (puntuacion > 0){
      if(ob==objetivo1) dificultad = dificultad + 1;
      if(ob==objetivo2) dificultad = dificultad + 2;
    }
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_pacman );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_pacman );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
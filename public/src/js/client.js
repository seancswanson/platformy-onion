(function() {

  // ----------  
  class Onion {
    // ----------  
    constructor() {
      const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight - 20,
        scene: {
          preload,
          create,
          update
        }
      };
        
      const game = new Phaser.Game(config);

      // ----------  
      function preload() {
        console.log('preload');
      }

      // ----------  
      function create() {
        console.log('create');
      }

      // ----------  
      function update() {
        console.log('update');
      }
    }

  }

  const OnionGame = new Onion();
})();

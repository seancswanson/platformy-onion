"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  // ----------  
  var Onion = // ----------  
  function Onion() {
    _classCallCheck(this, Onion);

    var config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight - 20,
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };
    var game = new Phaser.Game(config); // ----------  

    function preload() {
      console.log('preload');
    } // ----------  


    function create() {
      console.log('create');
    } // ----------  


    function update() {
      console.log('update');
    }
  };

  var OnionGame = new Onion();
})();

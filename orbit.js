//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Inconsolata']
    }
};

var States = {};

//*****************************************************************************************
//FONT LOAD STATE
//This is a 1 second state used to load the google webfont script
//It then loads the menu state
States.LoadFonts = function() {};
States.LoadFonts.prototype = {
    preload: function() {
        //load the font script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },
    create: function() {
        game.stage.backgroundColor = '#333333';
        // place the assets and elements in their initial positions, create the state 
        game.time.events.add(Phaser.Timer.SECOND, startGame, this)

        function startGame() {
            game.state.start('GameState');
        }
    },
    update: function() {}
};
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gameDiv', States.LoadFonts);

// *****************************************************************************************
// Main Game State
// These preload, create, and update functions are run during the main part of the game

States.GameState = function() {};
States.GameState.prototype = {
    preload: function() {
        //make a graphics object to contain a simple circle
        var graphics = game.add.graphics(0, 0);
        //WHITE, but each unit will need to be a different color
        graphics.beginFill(0xFFFFFF);
        //in general, each object is proportional to the height
        graphics.drawCircle(0, 0, game.height * .2);
        //an object
        game.circleTexture = graphics.generateTexture();
        //destroy it so it's not hanging around
        graphics.destroy();

        //we'll use this style to label the "hands"
        game.style = {
            font: 'Inconsolata', //change here and above
            fill: '#333333', //dk gray
            align: 'center',
            fontSize: game.height / 35 //proportional to height
        };
    },
    create: function() {
        //SECOND HAND
        //make the sprite in the center, but it will move at first update()
        game.second = game.add.sprite(game.width / 2, game.height / 2, game.circleTexture);
        //pretty small; still proportional to game.height
        game.second.scale.setTo(0.2, 0.2);
        //center the second circle
        game.second.anchor.setTo(0.5, 0.5);
        //a red tint
        game.second.tint = 0xff0000;
    },
    update: function() {
        //we need to calculate how many seconds have passed since midnight
        var now = new Date();
        /*new Date(
            years, 
            months, 
            days, 
            hours, minutes, seconds)*/
        var midnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0, 0, 0);
        //subtract the times to get the difference in ms
        var elapsedTime = (now.getTime() - midnight.getTime());
        elapsedTime /= 1000; //divide by 1000 to get the seconds
        //round the seconds
        elapsedTime = Math.round(elapsedTime);
        //console.log((elapsedTime%60/60))
        var secondRadius = 200; //distance from center

        //BROKEN
        //get the remainder (%) of the elapsed time divided by 60
        //that number could be 0-59
        //divide that by 60 to get a decimal 0-1
        //multiply that number by 2*Math.PI to get the factor for the sin/cos function
        var secondFactor = (elapsedTime % 60 / 60) * 2 * Math.PI;
        /*these sin and cos functions set the second hand circle the 
        appropriate x/y distance from the center, based on the secondFactor*/
        game.second.x = game.width / 2 + secondRadius * Math.sin(secondFactor);
        game.second.y = game.height / 2 + secondRadius * Math.cos(secondFactor);

        //if this isn't the first run, there's an old label hanging around
        if (typeof game.second.label !== 'undefined') {
            //destroy it
            game.second.label.destroy();
        }
        // this is the text for a label, with the number of seconds since the last minute
        var labelString = (elapsedTime % 60).toString();
        //make the label on top of the second hand circle
        var secondLabel = game.add.text(game.second.x, game.second.y, labelString, game.style);
        //center it
        secondLabel.anchor.setTo(0.5, 0.5);
        //add the label as a property of the sprite, so we can destroy it later
        game.second.label = secondLabel;
    }
};
game.state.add('GameState', States.GameState);

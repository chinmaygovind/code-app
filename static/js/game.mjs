import * as aristocrat from  "./aristocrat.mjs";
import * as hill from  "./hill.mjs";
import * as morbit from  "./morbit.mjs";
var puzzles = [];
var mode = "ARISTOCRAT";

class Game {

    createAristocratPuzzle() {
        
        $.ajax({
            url: 'fetch-puzzle?cipher=ARISTOCRAT',
            type: 'GET',
            success: function(response) {
                response = JSON.parse(response)
                console.log(response)
                for (let i = 0; i < puzzles.length; i++)
                    clearInterval(puzzles[i].update);
                let c = new aristocrat.Cryptogram(response.encrypted_text, response.id, response.alphabet);
                puzzles.push(c);
            },
            error: function(error) {
              console.log('Error:', error.responseText);
            }
          });
    }

    createHillPuzzle() {
        
        $.ajax({
            url: 'fetch-puzzle?cipher=HILL_2X2',
            type: 'GET',
            success: function(response) {
                response = JSON.parse(response)
                console.log(response)
                for (let i = 0; i < puzzles.length; i++)
                    clearInterval(puzzles[i].update);
                let c = new hill.Cryptogram(response.encrypted_text, response.id, response.alphabet, response.matrix);
                puzzles.push(c);
            },
            error: function(error) {
              console.log('Error:', error.responseText);    
            }
          });
    }

    createMorbitPuzzle() {
        
        $.ajax({
            url: 'fetch-puzzle?cipher=MORBIT',
            type: 'GET',
            success: function(response) {
                response = JSON.parse(response)
                console.log(response)
                for (let i = 0; i < puzzles.length; i++)
                    clearInterval(puzzles[i].update);
                let c = new morbit.Cryptogram(response.encrypted_text, response.id, response.alphabet, response.crib);
                puzzles.push(c);
            },
            error: function(error) {
              console.log('Error:', error.responseText);    
            }
          });
    }

    getPuzzle() {
        return puzzles[puzzles.length - 1];
    }

    checkAnswer(){
        this.getPuzzle().checkAnswer();
    }

}

var g = new Game();
$('#get-puzzle').on("click", function () {
    switch (mode) {
        case "ARISTOCRAT":
            g.createAristocratPuzzle();
            break;
        case "HILL":
            g.createHillPuzzle();
            break;
        case "MORBIT":
            g.createMorbitPuzzle();
            break;
    }
    $('#check-puzzle').show()
    $('#reset-puzzle').show()
 });

 $('#check-puzzle').on("click", function() {
        g.checkAnswer();
 })
 $('#reset-puzzle').on("click", function() {
    g.getPuzzle().reset();
})
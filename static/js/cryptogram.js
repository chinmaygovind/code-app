
//Box(target, encrypted, id, wordID)
ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


class Box {
    constructor(target, encrypted, id, wordID, cryptogram, hidden) {
        this.target = target;
        this.encrypted = encrypted;
        this.id = id;
        this.wordID = wordID;
        this.cryptogram = cryptogram;
        this.editValue = this.editValue.bind(this);
        this.highlight = this.highlight.bind(this);
        this.hidden = hidden;
    }

    editValue() {
        this.cryptogram.setAll(this.encrypted, $("#input-" + this.id).val().toUpperCase().slice(-1))
    }

    highlight() {
        this.cryptogram.highlightAll(this.encrypted);
    }
    
    display() {
        $("#word-" + this.wordID).append(
            '<div class = "box" id="letter-' + this.id + '"></div>'
        );
        $("#letter-" + this.id).append(
            '<h3 class = "cryptogram-encrypted" id="encrypted-' + this.id + '">' + this.encrypted + '</h3>'
        );
        if (this.encrypted.toUpperCase() != this.encrypted.toLowerCase()) {
        $("#letter-" + this.id).append(
            '<input class = "cryptogram-input" id="input-' + this.id + '">'
        );
        } else {
            $("#letter-" + this.id).append(
                '<input readonly value = "' + this.encrypted + '"class = "cryptogram-input" id="input-' + this.id + '">'
            );
        }
        $("#input-" + this.id).on("input", this.editValue);
        $("#input-" + this.id).on("focus", this.highlight);
        if (this.hidden) {
            $("#input-" + this.id).hide();
        }
    }


}

//Word([boxes])
class Word {
    constructor(letters, id, c) {
        this.letters = letters;
        this.id = id;
        this.c = c;
    }

    display() {
        $("#cryptogram").append(
            '<div class="word" id="word-' + this.id + '"></div>'
        );
        for (let x = 0; x < this.letters.length; x++) {
            this.letters[x].display();
        }
    }
}

class Cryptogram {
    constructor(ciphertext, puzzle_id) {
        this.ciphertext = ciphertext.toUpperCase();
        this.puzzle_id = puzzle_id;
        this.plainWords = this.ciphertext.split(" ");
        this.cipherWords = this.ciphertext.split(" ");
        this.words = [];
        this.boxes = [];
        this.boxID = 0;
        this.wordID = 0;

        this.time = 0;
        this.updateTime = this.updateTime.bind(this);
        this.update = setInterval(this.updateTime, 1000);
    }


    generateTiles() {
        $("#cryptogram").empty();
        for (let x = 0; x < this.plainWords.length; x++) {
            let word = new Word([], this.wordID, this);
            for (let l = 0; l < this.plainWords[x].length; l++) {
                let b = new Box(this.plainWords[x][l], this.cipherWords[x][l], this.boxID, this.wordID, this, false);
                word.letters.push(b);
                this.boxes.push(b);
                this.boxID++;
            }
            //add ghost space box
            if (x < this.plainWords.length - 1) {
                let b = new Box(" ", " ", this.boxID, this.wordID, this, true);
                word.letters.push(b);
                this.boxes.push(b);
                this.boxID++;
            }
            this.words.push(word);
            this.wordID++;
        }

        for (let i = 0; i < this.words.length; i++) {
            this.words[i].display();
        }

        //show timer
        $("#cryptogram").append("<div id='timer'></div>");
    }

    setAll(encrypted, setTo) {
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].encrypted == encrypted)
                $("#input-" + this.boxes[i].id).val(setTo);
        }
        this.focusNextEmpty();
    }

    highlightAll(encrypted) {
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].encrypted == encrypted)
                $("#input-" + this.boxes[i].id).addClass("highlighted");
            else 
                $("#input-" + this.boxes[i].id).removeClass("highlighted");
        }
    }

    focusNextEmpty() {
        let start = 0;
        if (document.activeElement.id.substring(0, 6) == "input-") {
            start = document.activeElement.id.substring(6);
        }
        let iterations = 0;
        for (let i = start; iterations < this.boxes.length; i++) {
            iterations++;
            if (i == this.boxes.length) 
                i = 0;
            if ($("#input-" + this.boxes[i].id).val() == "") {
                $("#input-" + this.boxes[i].id).focus();
                return;
            }
        }
    }

    updateTime() {
        this.time++;
        $("#timer").text("Time: " + String(Math.floor(this.time/60)) +  ":" + String(100 + this.time%60).slice(-2));
    }

    checkAnswer() {
        let answer = ""
        for (let i = 0; i < this.boxes.length; i++) {
            answer += $("#input-" + i).val();
        }
        console.log(answer);
        $.ajax({
            url: 'check-puzzle?' + 
            'puzzle_id=' + encodeURIComponent(this.puzzle_id) + 
            '&answer=' + encodeURIComponent(answer),
            type: 'GET',
            success: function(response) {
                response = JSON.parse(response)
                console.log(response)
            },
            error: function(error) {
              console.log('Error:', error.responseText);
            }
          });
    }

    reset() {
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].hidden == false && ALPHABET.includes(this.boxes[i].encrypted))
                $("#input-" + i).val("");
        }
    }
}




puzzles = [];

class Game {

    createPuzzle() {
        
        $.ajax({
            url: 'fetch-puzzle',
            type: 'GET',
            success: function(response) {
                response = JSON.parse(response)
                console.log(response)
                for (let i = 0; i < puzzles.length; i++)
                    clearInterval(puzzles[i].update);
                let c = new Cryptogram(response.encrypted_text, response.key);
                puzzles.push(c);
                c.generateTiles();
                c.focusNextEmpty();
            },
            error: function(error) {
              console.log('Error:', error.responseText);
            }
          });
    }

    getPuzzle() {
        return puzzles[puzzles.length - 1];
    }

}

let g = new Game();
$('#get-puzzle').on("click", function () {
    g.createPuzzle()
    $('#check-puzzle').show()
    $('#reset-puzzle').show()
 });

 $('#check-puzzle').on("click", function() {
        g.getPuzzle().checkAnswer();
 })
 $('#reset-puzzle').on("click", function() {
    g.getPuzzle().reset();
})
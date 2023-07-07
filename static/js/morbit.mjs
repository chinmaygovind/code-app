import { FrequencyTableBox } from "./aristocrat.mjs";

//Box(target, encrypted, id, wordID)
let ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


export class Box {
    constructor(encrypted, id, wordID, cryptogram, hidden) {
        this.encrypted = encrypted;
        this.id = id;
        this.wordID = wordID;
        this.cryptogram = cryptogram;
        this.editValue = this.editValue.bind(this);
        this.highlight = this.highlight.bind(this);
        this.hidden = hidden;
    }

    editValue() {
        $("#input-" + this.id).val($("#input-" + this.id).val().replaceAll('x', '×'));
        $("#input-" + this.id).val($("#input-" + this.id).val().replaceAll('.', '●'));
        $("#input-" + this.id).val($("#input-" + this.id).val().replaceAll('-', '–'));

        if ($("#input-" + this.id).val().length == 2){
            this.cryptogram.focusNextEmpty();
        }
        //this.cryptogram.setAll(this.encrypted, $("#input-" + this.id).val().toUpperCase().slice(-1))
    }

    highlight() {
        //this.cryptogram.highlightAll(this.encrypted);
    }
    
    display() {
        $("#word-" + this.wordID).append(
            '<div class = "box" id="letter-' + this.id + '"></div>'
        );
        $("#letter-" + this.id).append(
            '<h3 class = "cryptogram-encrypted" id="encrypted-' + this.id + '">' + this.encrypted + '</h3>'
        );
        
        $("#letter-" + this.id).append(
            '<input class = "cryptogram-input morbit-input" id="input-' + this.id + '">'
        );
        $("#input-" + this.id).on("input", this.editValue);
        $("#input-" + this.id).on("focus", this.highlight);

        $("#letter-" + this.id).append(
            '<input class = "cryptogram-input morbit-input" id="input-scratchwork-' + this.id + '">'
        )
        if (this.hidden) {
            $("#input-" + this.id).hide();
            $("#input-scratchwork-" + this.id).hide();
        }
    }

}

export class MappingBox extends Box {
    constructor(id, cryptogram) {
        super(id, id, null, cryptogram, false)
        this.editValue = this.editValue.bind(this);
    }

    display() {
        $("#mapping-letter-" + this.id).append(
            '<h3 class = "cryptogram-encrypted" id="mapping-encrypted-' + this.id + '">' + this.encrypted + '</h3>'
        );
        
        $("#mapping-letter-" + this.id).append(
            '<input class = "cryptogram-input" id="mapping-input-' + this.id + '">'
        );
        $("#mapping-input-" + this.id).on("input", this.editValue);
        $("#mapping-input-" + this.id).on("focus", this.highlight);
        $("#mapping-input-" + this.id).addClass("morbit-input")
        if (this.hidden) {
            $("#mapping-input-" + this.id).hide();
        }
    }

    
    editValue() {
        $("#mapping-input-" + this.id).val($("#mapping-input-" + this.id).val().replaceAll('x', '×'));
        $("#mapping-input-" + this.id).val($("#mapping-input-" + this.id).val().replaceAll('.', '●'));
        $("#mapping-input-" + this.id).val($("#mapping-input-" + this.id).val().replaceAll('-', '–'));

        if ($("#mapping-input-" + this.id).val().length == 2){
            this.cryptogram.focusNextEmpty();
        }
        //this.cryptogram.setAll(this.encrypted, $("#input-" + this.id).val().toUpperCase().slice(-1))
    }
}

//Word([boxes])
export class Word {
    constructor(letters, id, c) {
        this.letters = letters;
        this.id = id;
        this.c = c;
    }

    display() {
        console.log("displaying now");
        $("#cryptogram").append(
            '<div class="word" id="word-' + this.id + '"></div>'
        );
        for (let x = 0; x < this.letters.length; x++) {
            this.letters[x].display();
        }
    }
}
//TODO: refactor this to be Puzzle and make aristos and stuff extend it
export class Cryptogram {
    constructor(ciphertext, puzzle_id, alphabet, crib) {
        this.ciphertext = ciphertext.toUpperCase();
        this.puzzle_id = puzzle_id;
        this.alphabet = alphabet;
        this.crib = crib;
        this.word;
        this.boxes = [];
        this.mappingBoxes = [];


        this.updateTime = this.updateTime.bind(this);
        this.time = Date.now();
        this.startTime = Date.now();
        this.updateTimeID = window.setInterval(this.updateTime, 33);
        this.generateTiles();
        this.generateMap();
        this.generateResponseBox();
        this.focusNextEmpty();
        //show timer
        $("#cryptogram").append("<div id='timer'></div>");;
    }


    generateTiles() {
        $("#cryptogram").empty();
        let boxID = 0;
        this.word = new Word([], 0, this);
        for (let l = 0; l < this.ciphertext.length; l++) {
            let b = new Box(this.ciphertext[l], boxID, 0, this, false);
            this.word.letters.push(b);
            this.boxes.push(b);
            boxID++;
        }

        this.word.display();

        

    }

    generateMap() {
        //create frequency table
        $("#cryptogram").append("<table id='map'></table>");
        $("#map").append("<tr id = 'mapping'></tr>");
        $("#mapping").append("<th>Mapping</th>");
        for (var i = 1; i <= 9; i++) {
            let b = new MappingBox(i, this);
            $("#mapping").append(`<td id='mapping-letter-${i}'></td>`)
            b.display();
            if (i <= 4) {
                $(`#mapping-input-${i}`).val(this.crib.substring(2 * i - 2, 2 * i))
                b.editValue();
            }
        }
       
    }
    
    generateResponseBox() {
        $("#cryptogram").append("<label><b>Enter Answer:</b> </label>")
        $("#cryptogram").append("<input id='response' class='response-box'></input>")
    }

    highlightAll(encrypted) {
        console.log("highlight all " + encrypted);
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].encrypted == encrypted)
                $("#input-" + this.boxes[i].id).addClass("highlighted");
            else 
                $("#input-" + this.boxes[i].id).removeClass("highlighted");
        }
        for (let i = 0; i < this.frequencyTableBoxes.length; i++) {
            if (this.frequencyTableBoxes[i].encrypted == encrypted)
                $("#replacement-letter-input-" + this.frequencyTableBoxes[i].id).addClass("highlighted");
            else 
                $("#replacement-letter-input-" + this.frequencyTableBoxes[i].id).removeClass("highlighted");
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
        this.time = (Date.now() - this.startTime)/1000;
        $("#timer").text("Time: " 
        + String(Math.floor(100 + Math.floor(this.time/60))).slice(-2) +  
        ":" + String((100 + (this.time)%60).toFixed(3)).substring(1,));
    }

    checkAnswer() {
        let answer = $("#response").val().toUpperCase();
        console.log(answer);
        console.log(this.puzzle_id);
        $.ajax({
            url: 'check-puzzle',
            type: 'GET',
            data: {
                puzzle_id: encodeURIComponent(this.puzzle_id),
                answer: encodeURIComponent(answer),
                time_solved: encodeURIComponent(this.time)
            },
            success: function(response) {
                response = JSON.parse(response)
                if (response.solved === false) {
                    alert("Your response is incorrect. Keep trying, buddy.");
                } else if (response.solved === true) {
                    console.log("tryna clear interval")
                    window.clearInterval(this.updateTimeID);
                    alert("Congratulations! You solved this puzzle in " + response.time_solved + " seconds! That's worse than 98% of users!")
                    
                }
            },
            error: function(error) {
              console.log('Error:', error.responseText);
            }
          });
    }

    reset() {
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].hidden == false)
                $("#input-" + i).val("");
                $("#input-scratchwork-" + i).val("");
        }
        for (let i = 5; i <= 9; i++) {
            $("#mapping-input-" + i).val("");
        }
        this.focusNextEmpty();
    }
}



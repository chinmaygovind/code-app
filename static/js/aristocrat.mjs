
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

export class FrequencyTableBox extends Box {
    constructor(encrypted, id, cryptogram) {
        super(encrypted, id, null, cryptogram, false)
    }

    display() {
        $("#replacement-" + this.id).append(
            '<div class = "box" id="replacement-letter-' + this.id + '"></div>'
        );
        $("#replacement-letter-" + this.id).append(
            '<input class = "cryptogram-input" id="replacement-letter-input-' + this.id + '">'
        );
        
        $("#replacement-letter-input-" + this.id).on("input", this.editValue);
        $("#replacement-letter-input-" + this.id).on("focus", this.highlight);
        if (this.hidden) {
            $("#input-" + this.id).hide();
        }
    }

    
    editValue() {
        this.cryptogram.setAll(this.encrypted, 
            $("#replacement-letter-input-" + this.id).val().toUpperCase().slice(-1))
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
    constructor(ciphertext, puzzle_id, alphabet) {
        this.ciphertext = ciphertext.toUpperCase();
        this.puzzle_id = puzzle_id;
        this.alphabet = alphabet;
        this.plainWords = this.ciphertext.split(" ");
        this.cipherWords = this.ciphertext.split(" ");
        this.words = [];
        this.boxes = [];
        this.frequencyTableBoxes = [];


        this.updateTime = this.updateTime.bind(this);
        this.time = Date.now();
        this.startTime = Date.now();
        this.updateTimeID = window.setInterval(this.updateTime, 33);
        this.generateTiles();
        this.focusNextEmpty();
        //show timer
        $("#cryptogram").append("<div id='timer'></div>");
        this.generateFrequencyTable();
    }


    generateTiles() {
        let boxID = 0;
        let wordID = 0;
        $("#cryptogram").empty();
        for (let x = 0; x < this.plainWords.length; x++) {
            let word = new Word([], wordID, this);
            for (let l = 0; l < this.plainWords[x].length; l++) {
                let b = new Box(this.cipherWords[x][l], boxID, wordID, this, false);
                word.letters.push(b);
                this.boxes.push(b);
                boxID++;
            }
            //add ghost space box
            if (x < this.plainWords.length - 1) {
                let b = new Box(" ", boxID, wordID, this, true);
                word.letters.push(b);
                this.boxes.push(b);
                boxID++;
            }
            

            this.words.push(word);
            wordID++;
        }

        for (let i = 0; i < this.words.length; i++) {
            this.words[i].display();
        }

        

    }

    generateFrequencyTable() {
        //create frequency table
        $("#cryptogram").append("<table id='frequency-table'></table>");
        $("#frequency-table").append("<tr id = 'ciphertext'></tr>");
        $("#ciphertext").append("<th>Ciphertext</th>");
        for (var c = 0; c < this.alphabet.length; c++) {
            $("#ciphertext").append("<td>" + this.alphabet[c] + "</td>")
        }
        $("#frequency-table").append("<tr id = 'frequency'></tr>");
        $("#frequency").append("<th>Frequency</th>");
        for (var c = 0; c < this.alphabet.length; c++) {
            //count frequency of character
            var freq = 0;
            for (var b = 0; b < this.boxes.length; b++) {
                if (this.boxes[b].encrypted == this.alphabet[c]) freq++;
            }
            $("#frequency").append("<td>" + freq + "</td>")
        }
        $("#frequency-table").append("<tr id = 'replacement'></tr>");
        $("#replacement").append("<th>Replacement</th>");
        for (var c = 0; c < this.alphabet.length; c++) {
            //count frequency of character
            let b = new FrequencyTableBox(this.alphabet[c], c, this);
            $("#replacement").append("<td id = 'replacement-" + c + "'></td>")
            $("#replacement-" + c).append(b);
            this.frequencyTableBoxes.push(b);
            b.display();
        }
    }

    setAll(encrypted, setTo) {
        console.log("set all " + encrypted + " to " + setTo);
        for (let i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].encrypted == encrypted)
                $("#input-" + this.boxes[i].id).val(setTo);
        }
        for (let i = 0; i < this.frequencyTableBoxes.length; i++) {
            if (this.frequencyTableBoxes[i].encrypted == encrypted)
                $("#replacement-letter-input-" + this.frequencyTableBoxes[i].id).val(setTo);
        }
        this.focusNextEmpty();
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
        let answer = ""
        for (let i = 0; i < this.boxes.length; i++) {
            answer += $("#input-" + i).val();
        }
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
            if (this.boxes[i].hidden == false && this.alphabet.includes(this.boxes[i].encrypted))
                $("#input-" + i).val("");
        }
        for (let i = 0; i < this.frequencyTableBoxes.length; i++) {
            if (this.frequencyTableBoxes[i].hidden == false && this.alphabet.includes(this.boxes[i].encrypted))
                $("#replacement-letter-input-" + i).val("");
        }
        this.focusNextEmpty();
    }
}



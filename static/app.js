class BoggleGame {
    constructor(seconds = 60){
        this.board = $("#boggle");
        this.wordList = $("#word-List");
        this.seconds = seconds;
        this.displayTimer();
        this.timer = setInterval(this.tick.bind(this), 1000);

        this.score = 0;
        this.words = new Set();

        $(".form", this.board).on("submit", this.handleSubmitWord.bind(this));
    }

   displayMessage(msg, c) {
        $(".message", this.board)
        .text(msg)
        .removeClass()
        .addClass(`message ${c}`);
    }

    displayWord(word) {
        $(".words" , this.wordList).append($("<li>", {text: word}));
    }

    displayScore() {
        $(".score", this.board).text(this.score);
        if (this.score > 0){
            $(".score").addClass("ok");
        }
    }

 
    displayTimer() {
        $(".timer", this.board).text(this.seconds);
          if (this.seconds <= 10){
            $(".timer").addClass("err");
        }
    }


    async handleSubmitWord(evt){
        evt.preventDefault()

        const $word = $(".word")

        let word = $word.val()
        $(".form").trigger("reset")
        $(".form .word").focus()

        if(!word) return;

        if(this.words.has(word)) {
            this.displayMessage(`${word} Already found in the words list` , "err")
            return;
        }

        const res = await axios.get("/check-word", {params:{word: word}});

        if(res.data.result === "not-word") {
            this.displayMessage(`${word} is not a valid word` , "err")
        }
        else if (res.data.result === "not-on-board") {
            this.displayMessage(`${word} is not a valid word on this board` , "err")
        }
        else {
            this.displayWord(word);
            this.displayMessage(`Added : ${word}` , "ok");
            this.words.add(word);
            this.score += word.length;
            this.displayScore();
        }
    }


    async tick(){
        this.seconds -= 1;
        this.displayTimer();

        if(this.seconds === 0) {
            clearInterval(this.timer);
            await this.endGame();
        }
    }


    async endGame() {
        $(".form", this.board).hide();

        const resp = await axios.post("/post-score" , {score : this.score});
        if(resp.data.brokeRecord) {
            this.displayMessage(`New record: ${this.score}`, "ok");
        }
        else {
            this.displayMessage(`Final score: ${this.score}`, "ok");
        }
    }


}

new BoggleGame();
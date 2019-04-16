class Ticket {
    constructor(id, name, statusBets, questionBets) {
        this.id = id;
        this.name = name;
        this.statusBets = statusBets;
        this.questionBets = questionBets;
        this.statusHits = {};
        this.questionHits = {};
        this.points = 0;
    }
}

module.exports = Ticket;
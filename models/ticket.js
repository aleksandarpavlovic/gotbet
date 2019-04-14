class Ticket {
    constructor(id, name, statusBets, bonusBets) {
        this.id = id;
        this.name = name;
        this.statusBets = statusBets;
        this.bonusBets = bonusBets;
        this.statusHits = {};
        this.bonusHits = {};
        this.points = 0;
    }
}

module.exports = Ticket;
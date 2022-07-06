export class UserStats {
    rank: number;
    username: string;
    foolTheAI: number;
    solvableByHumans: number;
    numberOfAssociationsSolved: number;

    constructor(rank: number, username: string, foolTheAI: number, solvableByHumans: number, numberOfAssociationsSolved: number) {
        this.rank = rank;
        this.username = username;
        this.foolTheAI = foolTheAI;
        this.solvableByHumans = solvableByHumans;
        this.numberOfAssociationsSolved = numberOfAssociationsSolved;
    }
}
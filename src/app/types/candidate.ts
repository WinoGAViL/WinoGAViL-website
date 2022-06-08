export class Candidate {
    answer: boolean;
    userChoice: boolean;
    img: string;

    constructor(img: string, answer: boolean = false, userChoice: boolean = false) {
        this.img = img;
        this.answer = answer;
        this.userChoice = userChoice;
    }
}

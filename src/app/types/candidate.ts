export class Candidate {
    answer: boolean;
    userChoice: boolean;
    img: string;
    name: string;

    constructor(img: string, name, answer: boolean = false, userChoice: boolean = false) {
        this.img = img;
        this.answer = answer;
        this.userChoice = userChoice;
        this.name = name;
    }
}

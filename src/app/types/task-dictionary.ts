import {Candidate} from './candidate';
import {GuessTheAssociationsTask} from './guess-the-associations-task';

const guessTheAssociationsDictionary: Map<string, GuessTheAssociationsTask> = new Map<string, GuessTheAssociationsTask>()
const assetsImgPath = '/assets/img/';
const defaultCue = 'example-1';


export const createQualificationIndexIDMap = new Map();
createQualificationIndexIDMap.set(1, 'ablation_1');
createQualificationIndexIDMap.set(2, 'ablation_2');
createQualificationIndexIDMap.set(3, 'ablation_3');
createQualificationIndexIDMap.set(4, 'ablation_4');
createQualificationIndexIDMap.set(5, 'ablation_5');
createQualificationIndexIDMap.set(6, 'ablation_6');
createQualificationIndexIDMap.set(7, 'ablation_7');
createQualificationIndexIDMap.set(8, 'ablation_8');
createQualificationIndexIDMap.set(9, 'ablation_9');
createQualificationIndexIDMap.set(10, 'ablation_10');

export const solveQualificationIndexIDMap = new Map();
solveQualificationIndexIDMap.set(1, '16');
solveQualificationIndexIDMap.set(2, '11');
solveQualificationIndexIDMap.set(3, '18');
solveQualificationIndexIDMap.set(4, '8');
solveQualificationIndexIDMap.set(5, '1');
solveQualificationIndexIDMap.set(6, '24');
solveQualificationIndexIDMap.set(7, '25');
solveQualificationIndexIDMap.set(8, '30');
solveQualificationIndexIDMap.set(9, '37');
solveQualificationIndexIDMap.set(10, '39');

export const createExampleIndexIDMap = new Map();



export const solveExampleIndexIDMap = new Map();




export function getGuessTheAssociationsTask(cue): GuessTheAssociationsTask {
    if (guessTheAssociationsDictionary.has(cue)) {
        console.log(`Loading ${cue} task`)
        return GuessTheAssociationsTask.clone(guessTheAssociationsDictionary.get(cue));
    }
    return GuessTheAssociationsTask.clone(guessTheAssociationsDictionary.get(defaultCue))
}

// Guess the associations

// examples

guessTheAssociationsDictionary.set('example-1', new GuessTheAssociationsTask([new Candidate(assetsImgPath + 'drugs.png','drugs'), new Candidate(assetsImgPath + 'film.jpg', 'film'),
        new Candidate(assetsImgPath + 'puppy.jpg', 'puppy', true), new Candidate(assetsImgPath + 'needle.jpeg', 'needle'), new Candidate(assetsImgPath + 'venus.png', 'venus', true)],
    ['werewolf'], 2))

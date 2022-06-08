import {GiveTheCueTask} from './give-the-cue-task';

const numbersMap = new Map()
numbersMap.set('4', 'Four')
numbersMap.set('5', 'Five')
numbersMap.set('6', 'Six')
numbersMap.set('10', 'Ten')
numbersMap.set('12', 'Twelve')

const rangeMap = new Map()
rangeMap.set('4', '2-3')
rangeMap.set('5', '2-3')
rangeMap.set('6', '2-4')
rangeMap.set('10', '2-5')
rangeMap.set('12', '2-6')

export function cueCalculator(task: GiveTheCueTask): string {
    let numberOfCandidates: string = '5';
    try {
        numberOfCandidates = String(task.candidates[0].length);
    } catch {
        console.log('[cueCalculator]: Failed to get number of candidates.');
    }
    const range: string = rangeMap.get(numberOfCandidates)
    const numberOfRanges: string = numbersMap.get(numberOfCandidates);
    const base: string = `Your goal is to create visual associations that a rival AI cannot solve, but other humans can. <br><br> ${numberOfRanges} images are presented below. <br> Choose ${range} images and enter a cue word.<br>`
    return base;
}

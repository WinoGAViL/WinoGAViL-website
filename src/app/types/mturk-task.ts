export abstract class MturkTask {
    turkSubmitTo = '';
    assignmentId = '';
    id = '';
    isSixCandidates: boolean = false;

    abstract showHint(...args);

    showAIScore(score) {
        // const bonus = Number((score / 100) * 0.03).toFixed(3)
        if (score === 100) {
            this.showHint(`Perfect! AI Was Fooled! \n Your score: ${score}`, Math.pow(10, 10), '#e2f0d9', '#548235')
        } else if (score !== 0) {
            this.showHint(`AI Was almost Fooled! \n Your score: ${score}`, Math.pow(10, 10), '#fde3e4', '#f7931e')
        } else if (score === 0) {
            this.showHint(`You wre beaten by the AI! \n Maybe next time!`, Math.pow(10, 10), '#fff2cc', '#f96c7b')
        }
    }

    handleSubmit(assignmentId, turkSubmitTo, summaryJson) {
        console.log('JSON to send')
        console.log(summaryJson)
        if (!(assignmentId && turkSubmitTo)) {
            console.log('assignmentId and turkSubmitTo not good')
            return;
        }
        console.log(summaryJson)
        /****************************** MUST ******************************** */
            // const urlParams = new URLSearchParams(window.location.search)

            // create the form element and point it to the correct endpoint
        const form = document.createElement('form')
        // form.action = (new URL('mturk/externalSubmit', urlParams.get('turkSubmitTo'))).href
        form.action = turkSubmitTo + '/mturk/externalSubmit';
        form.method = 'post'

        // attach the assignmentId
        const inputAssignmentId = document.createElement('input')
        inputAssignmentId.name = 'assignmentId'
        // inputAssignmentId.value = urlParams.get('assignmentId')
        inputAssignmentId.value = assignmentId
        inputAssignmentId.hidden = true
        form.appendChild(inputAssignmentId)
        /******************************************************************** */

        /****************************** for you to choose  ******************************** */
        const inputSummaryJson = document.createElement('input')
        inputSummaryJson.name = 'summary_json'
        inputSummaryJson.value = JSON.stringify(summaryJson)
        inputSummaryJson.hidden = true
        form.appendChild(inputSummaryJson)
        /******************************************************************** */

        /****************************** MUST ******************************** */
        // attach the form to the HTML document and trigger submission
        document.body.appendChild(form)
        form.submit()
        /******************************************************************** */
    }
}

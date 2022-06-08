import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExperimentModeEnum} from '../../types/experiment-mode.enum';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
type matOptions = {value, viewValue};

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {
  @Input() skipPersonalDetails: boolean = false;
  @Output() submit$: EventEmitter<{reason: string, details: string}> = new EventEmitter<{reason: string, details: string}>()
  @Output() close$: EventEmitter<void> = new EventEmitter<void>()
  ages: matOptions[] = [{ value: 'inappropriateImage', viewValue: 'Inappropriate Image'}, { value: 'missingImage', viewValue: 'Missing Image'},
    { value: 'inappropriateCue', viewValue: 'Inappropriate Cue'}, { value: 'other', viewValue: 'Other'}]
  personalDetailsForm: FormGroup;
  instructionsOk = false;
  constructor(private fb: FormBuilder) {
    this.personalDetailsForm = this.fb.group({
      reason: ['', Validators.required],
      details: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  onSubmit(event) {
    if (this.personalDetailsForm.valid) {
      this.submit$.next(this.personalDetailsForm.value);
      console.log(this.personalDetailsForm.value);
    }
  }
}
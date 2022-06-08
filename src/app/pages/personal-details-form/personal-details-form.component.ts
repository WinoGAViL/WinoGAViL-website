import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ExperimentModeEnum} from '../../types/experiment-mode.enum';

type matOptions = {value, viewValue};


@Component({
  selector: 'app-personal-details-form',
  templateUrl: './personal-details-form.component.html',
  styleUrls: ['./personal-details-form.component.scss']
})
export class PersonalDetailsFormComponent implements OnInit {
  @Output() personalDetails$: EventEmitter<object> = new EventEmitter<object>();
  @Input() isCreate: boolean = false
  @Input() experimentMode: ExperimentModeEnum = ExperimentModeEnum.DEFAULT
  @Input() skipPersonalDetails: boolean = false;
  experimentModes: any = new Object(ExperimentModeEnum);
  ages: matOptions[] = [...Array(101).keys()].slice(-93).map(num => {return{ value: num, viewValue: num}})
  gender: matOptions[] = [{value: 'female', viewValue: 'Female'}, {value: 'male', viewValue: 'Male'},{viewValue: 'Non-binary', value: 'non-binary'},
    {viewValue: 'Transgender', value: 'transgender'}, {viewValue: 'Intersex', value: 'intersex'}, {viewValue: 'I prefer not to say', value: 'None'}];
  education: matOptions[] = [{value: 'None', viewValue: 'None'}, {value: 'ElementarySchool', viewValue: 'Elementary School'},{value: 'HighSchool', viewValue: 'High School'}
    ,{value: 'Bachelor', viewValue: 'College or University Bachelor'}, {value: 'Master', viewValue: 'College or University Master'}];
  speaker: matOptions[] = [{value: 'Native', viewValue: 'Yes'}, {value: 'NoneNative', viewValue: 'No'}];
  personalDetailsForm: FormGroup;
  instructionsOk = false;
  constructor(private fb: FormBuilder) {
    this.personalDetailsForm = this.fb.group({
      ages: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      speaker: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  onSubmit(event) {
    if (this.personalDetailsForm.valid) {
      this.personalDetails$.next(this.personalDetailsForm.value)
      console.log(this.personalDetailsForm.value);
    }
  }

  setInstructions() {
    this.instructionsOk = true;
    if (this.skipPersonalDetails) {
      this.personalDetails$.next({})
    }
  }

}

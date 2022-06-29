import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {catchError} from 'rxjs/operators';
import {of, Subscription, timer} from 'rxjs';


@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
    @Input() skipPersonalDetails: boolean = false;
    @Input() enterUserName: boolean = false;
    @Input() loading: boolean = false;
    @Output() registeredSuccessfully$ = new EventEmitter();
    @Output() submit$: EventEmitter<{ reason: string, details: string }> = new EventEmitter<{ reason: string, details: string }>()
    @Output() close$: EventEmitter<void> = new EventEmitter<void>()
    ages: any[] = [{value: 'inappropriateImage', viewValue: 'Inappropriate Image'}, {value: 'missingImage', viewValue: 'Missing Image'},
        {value: 'inappropriateCue', viewValue: 'Inappropriate Cue'}, {value: 'other', viewValue: 'Other'}]
    userDetailsForm: FormGroup;
    instructionsOk = false;
    cueValueChangesSubscription = new Subscription();
    clearHintSubscription = new Subscription();
    hint = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private changeDetectionRef: ChangeDetectorRef) {
        this.userDetailsForm = this.fb.group({
            username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z0-9]*$/)]),
        })
    }

    ngOnInit(): void {
    }

    onSubmit(event) {
        if (this.userDetailsForm.valid) {
            this.authService.registerUser(this.userDetailsForm.controls.username.value).pipe(
                catchError(() => of('Signup is unavailable at the moment'))).subscribe((response) => {
                    if (response?.status === 'EMAIL_EXISTS') {
                        this.hint = 'Email already exists'
                    } else if (response?.status === 'USERNAME_EXISTS') {
                        this.hint = 'Username already exists'
                    } else if (response?.status === 'SUCCESS') {
                        this.registeredSuccessfully$.next()
                    } else {
                        this.hint = 'Signup is unavailable at the moment'
                    }
                this.changeDetectionRef.markForCheck();
                this.changeDetectionRef.detectChanges();
            })
        } else {
            this.clearHintSubscription.unsubscribe();
            this.hint = 'Username should contain only english letters'
            this.changeDetectionRef.markForCheck();
            this.changeDetectionRef.detectChanges();
            this.clearHintSubscription = timer(5000).subscribe(() =>  {
                this.hint = ''
                this.changeDetectionRef.markForCheck();
                this.changeDetectionRef.detectChanges();
            })
        }
    }

    login(provider: 'yahoo' | 'google') {
        this.authService.login(provider)
    }
}
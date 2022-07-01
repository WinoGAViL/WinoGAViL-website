import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {of, Subscription, timer} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-no-more-tasks-modal',
  templateUrl: './no-more-tasks-modal.component.html',
  styleUrls: ['./no-more-tasks-modal.component.scss']
})
export class NoMoreTasksModalComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit(event) {
  }

  detectChanges() {
  }
}
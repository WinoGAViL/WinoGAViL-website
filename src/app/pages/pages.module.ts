import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MainComponent } from './main/main.component';
import {TaskBoardComponent} from '../task-bord/task-board.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BeatTheAiComponent } from './beat-the-ai/beat-the-ai.component';
import { DownloadComponent } from './download/download.component';
import {MatInputModule} from '@angular/material/input';
import { MturkCreateComponent } from './mturk-create/mturk-create.component';
import { MturkSolveComponent } from './mturk-solve/mturk-solve.component';
import { MturkCreateQualificationComponent } from './mturk-create-qualification/mturk-create-qualification.component';
import { MturkSolveQualificationComponent } from './mturk-solve-qualification/mturk-solve-qualification.component';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';
import {MatButtonModule} from '@angular/material/button';
import {beatTheAI, beatTheAICreate, beatTheAISolve, solveCratePath} from '../app-routing.module';
import {NavbarComponent} from '../navbar/navbar/navbar.component';
import {MatFormFieldModule} from '@angular/material/form-field';

const routes: Routes = [
  { path: beatTheAI, component: BeatTheAiComponent },
  { path: beatTheAICreate, component: BeatTheAiComponent },
  { path: beatTheAISolve, component: BeatTheAiComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'mturk/create/:id', component: MturkCreateComponent },
  { path: 'mturk/solve/:id', component: MturkSolveComponent },
  { path: solveCratePath, component: MturkSolveComponent },
  { path: 'mturk/qualification/create', component: MturkCreateQualificationComponent },
  { path: 'mturk/qualification/solve', component: MturkSolveQualificationComponent },
  { path: 'mturk/qualification/rg/create', component: MturkCreateQualificationComponent },
    { path: 'mturk/qualification/rg/ai/create', component: MturkCreateQualificationComponent },
  { path: 'mturk/qualification/oa/create', component: MturkCreateQualificationComponent },
    { path: 'mturk/qualification/oa/ai/create', component: MturkCreateQualificationComponent },
  { path: 'mturk/qualification/oh/create', component: MturkCreateQualificationComponent },
    { path: 'mturk/qualification/oh/ai/create', component: MturkCreateQualificationComponent },
  { path: 'mturk/qualification/nr/create', component: MturkCreateQualificationComponent },
    { path: 'mturk/qualification/nr/ai/create', component: MturkCreateQualificationComponent },
  { path: '**', component: MainComponent },
]

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
        BsDropdownModule.forRoot(),
        ProgressbarModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        CollapseModule.forRoot(),
        JwBootstrapSwitchNg2Module,
        TabsModule.forRoot(),
        PaginationModule.forRoot(),
        AlertModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CarouselModule.forRoot(),
        ModalModule.forRoot(),
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatSelectModule,
        MatButtonModule,
        MatFormFieldModule
    ],
  declarations: [
    MainComponent,
    NavbarComponent,
    TaskBoardComponent,
    BeatTheAiComponent,
    DownloadComponent,
    MturkCreateComponent,
    MturkSolveComponent,
    MturkCreateQualificationComponent,
    MturkSolveQualificationComponent,
    PersonalDetailsFormComponent
  ],
  exports: [
    MainComponent,
    NavbarComponent,
    TaskBoardComponent,
    RouterModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: document.getElementsByTagName('base')[0].href}]
})
export class PagesModule {}
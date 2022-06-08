import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import {MainComponent} from './pages/main/main.component';
import {DownloadComponent} from './pages/download/download.component';
import {BeatTheAiComponent} from './pages/beat-the-ai/beat-the-ai.component';
import {MturkCreateComponent} from './pages/mturk-create/mturk-create.component';
import {MturkSolveComponent} from './pages/mturk-solve/mturk-solve.component';
import {MturkCreateQualificationComponent} from './pages/mturk-create-qualification/mturk-create-qualification.component';
import {MturkSolveQualificationComponent} from './pages/mturk-solve-qualification/mturk-solve-qualification.component';

export const solveCratePath = 'mturk/solve/create/:id';
export const beatTheAI = 'beat-the-ai';
export const beatTheAICreate = 'beat-the-ai/create';
export const beatTheAISolve = 'explore';

const routes: Routes = [
  { path: '*', component: MainComponent},
  { path: 'main', component: MainComponent },
  { path: 'download', component: DownloadComponent },
  { path: beatTheAI, component: BeatTheAiComponent },
  { path: beatTheAICreate, component: BeatTheAiComponent },
  { path: beatTheAISolve, component: BeatTheAiComponent },
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
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: []
})
export class AppRoutingModule {}

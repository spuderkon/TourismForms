import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IsSignedInAuthGuard } from '../guards/isSignedInAuthGuard/is-signed-in-auth.guard';
import { AuthGuard } from '../guards/authGuard/auth.guard';
import { SurveysComponent } from './surveys/surveys.component';

import { FormsComponent } from './forms/forms.component';

import { SurveyComponent } from './survey/survey.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { FormComponent } from './form/form.component';
import { FormGuard } from '../guards/formGuard/form.guard';
import { SurveyGuard } from '../guards/surveyGuard/survey.guard';
import { FillMethodComponent } from './crud/fill-method/fill-method.component';
import { MeasureComponent } from './crud/measure/measure.component';
import { MunicipalityComponent } from './crud/municipality/municipality.component';

//, data: {IsAdmin: ['True','False']}

export const routes: Routes = [
  {path: "auth", component:AuthorizationComponent, canActivate:[IsSignedInAuthGuard]}, 
  {path: "forms", component:FormsComponent, canActivate:[AuthGuard], data: {IsAdmin: ['True']}},
  {path: "surveys", component:SurveysComponent, canActivate:[AuthGuard], data: {IsAdmin: ['True','False']}},
  {path: "admin/surveys", component:SurveysComponent, canActivate:[AuthGuard], data: {IsAdmin: ['True']}},
  {path: "survey/:id", component:SurveyComponent, canActivate:[AuthGuard, SurveyGuard], data: {IsAdmin: ['True','False']}},
  {path: "admin/survey/:id", component:SurveyComponent, canActivate:[AuthGuard, SurveyGuard], data: {IsAdmin: ['True']}},
  {path: "survey/:id/edit", component:SurveyComponent, canActivate:[AuthGuard, SurveyGuard], data: {IsAdmin: ['True']}},
  {path: "form/:id", component:FormComponent, canActivate:[AuthGuard, FormGuard], data: {IsAdmin: ['True']}},
  {path: "form/create", component:FormComponent, canActivate:[AuthGuard], data: {IsAdmin: ['True']}},
  {path: "crud/measure", component:MeasureComponent, canActivate:[AuthGuard], data: {IsAdmin: ['True']}},
  {path: "crud/fillMethod", component:FillMethodComponent, canActivate:[AuthGuard], data: {IsAdmin: ['True']}},
  {path: "crud/municipality", component:MunicipalityComponent, canActivate:[AuthGuard], data: {IsAdmin: ['True']}},
  {path: "", redirectTo: "surveys", pathMatch: "full"},
  {path: "**", redirectTo: "surveys", pathMatch: "full"},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

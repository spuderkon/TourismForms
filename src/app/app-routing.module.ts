import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IsSignedInAuthGuard } from '../guards/isSignedInAuthGuard/is-signed-in-auth.guard';
import { AuthGuard } from '../guards/authGuard/auth.guard';
import { SurveysComponent } from './surveys/surveys.component';

import { FormsComponent } from './forms/forms/forms.component';

import { SurveyComponent } from './survey/survey/survey.component';
import { AuthorizationComponent } from './authorization/authorization/authorization.component';
import { FormComponent } from './form/form/form.component';
import { IsCreateParamGuard } from '../guards/IsCreateParamGuard/is-create-param.guard';
import { IsNumberParamGuard } from '../guards/IsNumberParamGuard/is-number-param.guard';

//, data: {isAdmin: ['true','false']}

export const routes: Routes = [
  {path: "auth", component:AuthorizationComponent, canActivate:[IsSignedInAuthGuard]}, 
  {path: "forms", component:FormsComponent, canActivate:[AuthGuard]},
  {path: "surveys", component:SurveysComponent, canActivate:[AuthGuard]},
  {path: "survey/:id", component:SurveyComponent, canActivate:[AuthGuard, IsNumberParamGuard]},
  {path: "form/:id", component:FormComponent, canActivate:[AuthGuard, IsNumberParamGuard]},
  {path: "form/create", component:FormComponent, canActivate:[AuthGuard]},
  {path: "", redirectTo: "/surveys", pathMatch: "full"},
  {path: "**", component:SurveysComponent, canActivate:[AuthGuard]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { FormsComponent, SelectMunicipalityDialog } from './forms/forms/forms.component';
import { SurveysComponent } from './surveys/surveys.component';
import { FormComponent } from './form/form/form.component';
import { SurveyComponent } from './survey/survey/survey.component';
import { AuthorizationComponent } from './authorization/authorization/authorization.component';
import { HttpClientModule, withFetch } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    AuthorizationComponent,
    FormsComponent,
    FormComponent,
    SurveysComponent,
    SurveyComponent,
    SelectMunicipalityDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

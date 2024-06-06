import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { LOCALE_ID } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { ChooseDatesDialog, FormsComponent, SelectMunicipalityDialog } from './forms/forms.component';
import { SurveyExtendDialog, SurveyRevisionDialog, SurveysComponent } from './surveys/surveys.component';
import { FormComponent } from './form/form.component';
import { SurveyComponent } from './survey/survey.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { HttpClientModule, withFetch } from '@angular/common/http';
import { FillMethodComponent } from './crud/fill-method/fill-method.component';
import { DeleteMeasureDialog, EditMeasureDialog, MeasureComponent } from './crud/measure/measure.component';
import { DeleteMunicipalityDialog, EditMunicipalityDialog, MunicipalityComponent } from './crud/municipality/municipality.component';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    AuthorizationComponent,
    FormsComponent,
    FormComponent,
    SurveysComponent,
    SurveyComponent,
    SelectMunicipalityDialog,
    ChooseDatesDialog,
    FillMethodComponent,
    MeasureComponent,
    MunicipalityComponent,
    EditMeasureDialog,
    DeleteMeasureDialog,
    EditMunicipalityDialog,
    DeleteMunicipalityDialog,
    SurveyRevisionDialog,
    SurveyExtendDialog
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
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

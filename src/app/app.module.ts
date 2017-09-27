import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { NearEventsPage} from '../pages/near-events/near-events';
import { CreateEventsPage } from '../pages/create-events/create-events';
import { MyEventsPage } from '../pages/my-events/my-events';
import { OwnEventsPage } from '../pages/own-events/own-events';
import { AssistedEventsPage } from '../pages/assisted-events/assisted-events';
import { MapPage } from '../pages/map/map';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    NearEventsPage,
    CreateEventsPage,
    MyEventsPage,
    OwnEventsPage,
    AssistedEventsPage,
    MapPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    NearEventsPage,
    CreateEventsPage,
    MyEventsPage,
    OwnEventsPage,
    AssistedEventsPage,
    MapPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

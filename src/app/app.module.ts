import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { AssistedEventsPage } from '../pages/assisted-events/assisted-events';
import { CreateEventsPage } from '../pages/create-events/create-events';
import { EventsDetailPage } from '../pages/events-detail/events-detail';
import { LoginPage } from '../pages/login/login';
import { MyEventsPage } from '../pages/my-events/my-events';
import { NearEventsPage} from '../pages/near-events/near-events';
import { OwnEventsPage } from '../pages/own-events/own-events';
import { InscribedEventsPage } from '../pages/inscribed-events/inscribed-events';
import { SignupPage } from '../pages/signup/signup';
import { UpdateProfilePage } from '../pages/update-profile/update-profile';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { HttpModule } from '@angular/http';
import { DatePickerModule } from 'ion-datepicker';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { ConfigProvider } from '../providers/config/config';

const firebaseConfig = {
  apiKey: "AIzaSyCFWCNyDZt5IP8zU7Uytq7my1hgbpjBMAk",
  authDomain: "eventu-2a490.firebaseapp.com",
  databaseURL: "https://eventu-2a490.firebaseio.com",
  projectId: "eventu-2a490",
  storageBucket: "eventu-2a490.appspot.com",
  messagingSenderId: "163073188865"
};

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
    EventsDetailPage,
    UpdateProfilePage,
      InscribedEventsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    DatePickerModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),

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
    EventsDetailPage,
    UpdateProfilePage,
      InscribedEventsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeolocationProvider,
    FirebaseProvider,
    ConfigProvider,
  
  ]
})
export class AppModule {}

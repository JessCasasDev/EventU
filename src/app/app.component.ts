import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { NearEventsPage } from "../pages/near-events/near-events"
import { CreateEventsPage } from "../pages/create-events/create-events"
import { MyEventsPage } from '../pages/my-events/my-events';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, icon:string, component: any}>;
  user: {name:string, avatar: String};

  constructor(public platform: Platform, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, public events: Events) {
    this.initializeApp();
    this.pages = [
      {title: "Eventos Cercanos", icon:"home",component: NearEventsPage},
      {title: "Crear Evento", icon:"add",component: CreateEventsPage},
      {title: "Mis Eventos", icon: "person", component: MyEventsPage },
    ];
    events.subscribe('user:login', (name,avatar) => {
      this.setUser(name,avatar);
    });
  }

  initializeApp() {
    this.user = {name:"",avatar:"assets/img/profiletest.png"}
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if(!(this.nav.getActive().name == "NearEventsPage" && this.nav.getActive().name == page.component.name))
      this.nav.setRoot(page.component);
  }

  public setUser(name,avatar){
    this.user.name = name;
    //TODO Uncomment if(avatar != "") this.user.avatar = avatar;
  }
}

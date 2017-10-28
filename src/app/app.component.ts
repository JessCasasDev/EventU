import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NearEventsPage } from "../pages/near-events/near-events"
import { CreateEventsPage } from "../pages/create-events/create-events"
import { MyEventsPage } from '../pages/my-events/my-events';
import { LoginPage } from '../pages/login/login';

import { FirebaseProvider } from '../providers/firebase/firebase'
import { ConfigProvider } from '../providers/config/config'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, icon:string, component: any}>;
  user: {id:string, name:string, avatar: String};

  constructor(public platform: Platform, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, public eventsPro: Events,
              public firePro: FirebaseProvider, public configPro: ConfigProvider) {
    this.initializeApp();
    this.pages = [
      {title: "Eventos Cercanos", icon:"home",component: NearEventsPage},
      {title: "Crear Evento", icon:"add",component: CreateEventsPage},
      {title: "Mis Eventos", icon: "person", component: MyEventsPage },
    ];
    eventsPro.subscribe('user:login', (id,name,avatar) => {
      this.setUser(id,name,avatar);
    });
  }

  initializeApp() {
    this.user = {id:"",name:"",avatar:"assets/img/profiletest.png"}
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

  setUser(id,name,avatar){
    this.user.id = id;
    this.user.name = name;
    //TODO Uncomment if(avatar != "") this.user.avatar = avatar;
  }

  logout(){
    this.configPro.presentLoading("Cerrando sesión");
    this.firePro.logout().then( data => {
      this.nav.setRoot(LoginPage);
    });
  }
  
}

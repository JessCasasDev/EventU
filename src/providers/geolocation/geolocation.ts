import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Platform, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class GeolocationProvider {
  public lat: number;
  public lng: number;
  gps_tries = 1;
  user_position = null;
  timeout = 10000;
  
  constructor(public http: Http, private geolocation : Geolocation,  
    public locationAccuracy : LocationAccuracy,  private platform : Platform, 
    public alertCtrl : AlertController) {

    console.log('Hello GeolocationProvider Provider');
    this.lat = 4.6381938; //Position Example 
    this.lng = -74.0862351; //University's Geoposition
  
  }

  getPosition(timeout): Promise<any> {
    return new Promise((resolve, reject) => {
      var options = { timeout: timeout, enableHighAccuracy: true }
      this.platform.ready().then(() => {
        this.geolocation.getCurrentPosition(options).then(data => {
          this.lat = data.coords.latitude;
          this.lng = data.coords.longitude;
          let position = {
            lat: this.lat,
            lng: this.lng
          }
          this.user_position = position;
          resolve(position);
        }, (err) => {
          if (this.platform.is('mobileweb') || !this.platform.is('android') && !this.platform.is('ios')) {
            console.log("is not movil");
            this.lat = 4.6713254;
            this.lng = -74.05937569999999;
            let position = {
              lat: this.lat,
              lng: this.lng
            } // Geoposition example
            resolve(position);
          } else {
            console.log("No GPS", err);
            reject(err);
          }
        });
      });
    });
  }

  checkIfGpsOn() {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
              console.log('Request successful');
              resolve("GPS is on");
            }, (error) => {
              console.log('Error requesting location permissions', error);
              let alert = this.alertCtrl.create({
                title: 'GPS Error',
                message: 'No se pudo obtener tu posición, por favor vuelve a intentarlo',
                buttons: [
                  {
                    text: 'Enciende tu GPS',
                    handler: () => {
                      if (this.gps_tries < 2) {
                        this.gps_tries += 5;
                        this.checkIfGpsOn();
                      }
                    }
                  }
                ]
              });
              alert.present();
              if (error.code == this.locationAccuracy.ERROR_USER_DISAGREED) {
                reject();
              }
            });
          } else {
            console.log('Can NOT request location accuracy, let check permissions');
            reject();
          }
        });
      });
    });
  }

}

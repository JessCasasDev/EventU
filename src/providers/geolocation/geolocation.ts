import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GeolocationProvider {

  lat = 4.6381938; //Position Example 
  lng = -74.0862351; //University's Geoposition

  constructor(public http: Http) {
    console.log('Hello GeolocationProvider Provider');
  }

}

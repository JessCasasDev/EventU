import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnEventsPage } from './own-events';

@NgModule({
  declarations: [
    OwnEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnEventsPage),
  ],
})
export class OwnEventsPageModule {}

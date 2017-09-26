import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssistedEventsPage } from './assisted-events';

@NgModule({
  declarations: [
    AssistedEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(AssistedEventsPage),
  ],
})
export class AssistedEventsPageModule {}

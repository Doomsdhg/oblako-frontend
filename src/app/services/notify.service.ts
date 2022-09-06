import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Constants } from './notify.service.constants';
import { MessageType } from './notify.service.types';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private matSnackBar: MatSnackBar) { }

  public showMessage(message: string, messageType: MessageType): void {
    const config = this.createConfig(messageType);
    this.matSnackBar.open(message, undefined, config);
  }

  private createConfig(messageType: MessageType): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.duration = Constants.SNACKBAR_CONFIG.DURATION;
    config.panelClass = [messageType + Constants.SNACKBAR_CONFIG.CLASSNAME_POSTFIX];
    return config;
  }
}
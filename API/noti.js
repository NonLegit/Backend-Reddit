import { Service, Inject } from 'typedi';
import { LogicError } from '../../errors/logicError';
import admin from 'firebase-admin';
import appRoot from "app-root-path";
import mongoose from "mongoose";
import config from "../../config/index";
import { NotFoundError } from '../../errors/notFound';
import notFoundError from '../../localization/errors/notFoundError/notFoundError';

@Service()
export default class FirebaseTokenService {

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('driverModel') private driverModel: Models.DriverModel,
    @Inject('notificationModel') private notificationModel: Models.NotificationModel,
  )  {
    admin.initializeApp({
      credential: admin.credential.cert(`${appRoot}/src/config/firebase.json`),
    });
  }

  public async orderDelivered(userId: any): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundError(notFoundError.userNotFound);

    return this.sendNotification(user.firebaseToken,userId, 'Order delivered', 'Your order is now available at the box.');
  }

  public async orderCanceled(driverId: any): Promise<void> {
    const driver = await this.driverModel.findById(driverId);
    if (!driver) throw new NotFoundError(notFoundError.driverNotFound);
    return this.sendNotification(driver.firebaseToken,driverId, 'Order canceled', 'Unfortunately one order was canceled!!.');
  }

  // public async addFirebaseToken(userId: string, token: string): Promise<void> {
  //   const user = await this.userModel.findByIdAndUpdate(userId, { firebaseToken: token });
  //   if (!user) throw new LogicError('User not found', 404);
  //   return;
  // }
  private async sendNotification(firebaseToken: string,userId: mongoose.ObjectId, title:string, message: string): Promise<void> {

    if(config.notification.enabled === false) return;

    const payload = {
      notification: {
        title: title,
        body: message,
      }
    };
    if(firebaseToken) 
    {
      admin.messaging().sendToDevice(firebaseToken, payload);
      this.notificationModel.create({
        title,
        body: message,
        userId
      })
    }
    
    return;
  }
}
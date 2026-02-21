// We are bulding Notification service, where we want to send notification like notificationService.send('Hello World');

// We got 3 external providers. These simulate third-party SDKs.
class EmailProvider {
  sendEmail(content: string) {
    console.log("Sending Email:", content);
  }
}

class SmsProvider {
  sendSMS(content: string) {
    console.log("Sending SMS:", content);
  }
}

class WhatsappProvider {
  sendWa(content: string) {
    console.log("Sending Whatsapp:", content);
  }
}

// Our system expectation
interface INotificationService {
  send(message: string): void;
}

// We will use adapter to translate provider methods (sendEmail, sendSms...) to send() which our system understands
class EmailAdapter implements INotificationService {
  constructor(private readonly provider: EmailProvider) {}

  send(message: string): void {
    this.provider.sendEmail(message);
  }
}

class SmsAdapter implements INotificationService {
  constructor(private readonly provider: SmsProvider) {}

  send(message: string): void {
    this.provider.sendSMS(message);
  }
}

class WhatsappAdapter implements INotificationService {
  constructor(private readonly provider: WhatsappProvider) {}

  send(message: string): void {
    this.provider.sendWa(message);
  }
}

type INotificationType = "Email" | "Sms" | "Whatsapp";


const notificationProviders: Record<INotificationType,() => INotificationService> = {
  Email: () => new EmailAdapter(new EmailProvider()),
  Sms: () => new SmsAdapter(new SmsProvider()),
  Whatsapp: () => new SmsAdapter(new SmsProvider()),
};

class NotificationFactory {
  static create(type: INotificationType): INotificationService {
    const notificationProvider = notificationProviders[type];
    return notificationProvider();
  }
}

// client code
function notify(type: INotificationType, message: string) {
  const provider = NotificationFactory.create(type);
  provider.send(message);
}

notify("Email", "Dear");
notify("Whatsapp", "Hey there!");

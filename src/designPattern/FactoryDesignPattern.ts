// Basic factory example : Factory Design pattern is a creational design pattern that hide the object creational
// from client. Also decouple the client/bussiness logic from object creation logic.
// and client ask factory to give me an object that follows this contact(interface)

//! interface, client only worries about object following this interface.
type PaymentType = "credit" | "crypto" | "wallet";

interface PaymentMethod {
  payment(amount: number): void;
}

// concrete classes
class CreditCardPayment implements PaymentMethod {
  payment(amount: number): void {
    console.log(`Paying ${amount} using CreditCard `);
  }
}

class CryptoPayment implements PaymentMethod {
  payment(amount: number): void {
    console.log(`Paying ${amount} using Crypto `);
  }
}

class WalletPayment implements PaymentMethod {
  payment(amount: number): void {
    console.log(`Paying ${amount} using Wallet `);
  }
}

// class PaymentFactory {
//   static createPayment(type: PaymentType): PaymentMethod {
//     switch (type) {
//       case "credit":
//         return new CreditCardPayment();

//       case "crypto":
//         return new CryptoPayment();

//       default:
//         throw new Error(`Payment type ${type} not supported.`);
//     }
//   }
// }

// // better and scalable way to do it. Avoid switch case and use map
// const PaymentRegister: Record<PaymentType, new () => PaymentMethod> = {
//   credit: CreditCardPayment,
//   crypto: CryptoPayment,
//   wallet: WalletPayment,
// };

// class PaymentFactory {
//   static createPayment(type: PaymentType): PaymentMethod {
//     const paymentClass = PaymentRegister[type];
//     return new paymentClass();
//   }
// }

// const clientPaymethod = PaymentFactory.createPayment("credit");
// clientPaymethod.payment(200);

// deel style, create new static methods for each type
class PaymentFactory {
    static buildCreditPayment(): CreditCardPayment {
      return new CreditCardPayment();
    }
  
    static buildCryptoPayment(): PaymentMethod {
      return new CryptoPayment();
    }
  }
  
  const clientPaymethod = PaymentFactory.buildCreditPayment();
  clientPaymethod.payment(200);
  
  const clientPaymethod2 = PaymentFactory.buildCryptoPayment();
  clientPaymethod2.payment(200);
  
  export {}
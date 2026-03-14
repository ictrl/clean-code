// We got 2 external providers. These simulate third-party SDKs.
class BvnkProvider {
  verify(wallet: string) {
      if (wallet.length < 8 || !wallet.startsWith('BVNK')) {
          throw new Error('status: null, wallet is invalid');
      } else return true
  }
}

class VisaProvider {
  private readonly WALLET_MIN_LENGTH = 8;
  crossCheck(wallet: string) {
      if (wallet.length < this.WALLET_MIN_LENGTH || !wallet.startsWith('VISA')) {
          throw ({
              success: false,
              code: 400,
              message: 'Wallet Validation failed'
          });
      } else return {
          success: true,
          code: 200,
          message: 'Wallet is valid'
      }
  }
}

// Our system expectation (contract)
interface IWalletService {
  validate(wallet: string): IResponse;
}

type IResponse = {
  message: string;
  success: boolean;
}

type IWalletType = "BVNK" | "VISA";

//* We will use adapter to translate provider methods (verify(), crossCheck()) to validate() which our system understands
class BvnkAdapter implements IWalletService {
  constructor(private readonly provider: BvnkProvider) { }

  validate(message: string): IResponse {
      try {
          const response = this.provider.verify(message);
          return {
              message: 'Wallet is verfied',
              success: true
          }
      } catch (error) {
          return {
              message: 'Wallet is not verfied',
              success: false
          }
      }
  }
}

class VisaAdapter implements IWalletService {
  constructor(private readonly provider: VisaProvider) { }

  validate(message: string): IResponse {
      try {
          const response = this.provider.crossCheck(message);
          return {
              message: response.message,
              success: response.success
          }
      } catch (error) {
          return {
              message: error.message,
              success: false
          }
      }
  }
}


const notificationProviders: Record<IWalletType, () => IWalletService> = {
  BVNK: () => new BvnkAdapter(new BvnkProvider()),
  VISA: () => new VisaAdapter(new VisaProvider()),
};

class WalletFactory {
  static create(type: IWalletType): IWalletService {
      const notificationProvider = notificationProviders[type];
      return notificationProvider();
  }
}

class PaymentService {
  static validateWallet(type: IWalletType, wallet: string) {
      const provider = WalletFactory.create(type);
      return provider.validate(wallet);
  }
}

// client code using Payment Service

export { }

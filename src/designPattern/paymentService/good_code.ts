// we need to integrate wallet provider (coinbase, BVNK) in our payment service, we need to use validate user wallet

//* now we need to integrate BINANCE

//* mock

class CoinbaseProvider {
    private readonly MIN_WALLET_LENGTH = 8;
    validateWallet(wallet: string) {
        if (wallet.length < this.MIN_WALLET_LENGTH || !wallet.startsWith('CB_')) {

            return {
                status: false,
                msg: 'wallet not valid'
            }
        }
        return {
            status: true,
            msg: 'wallet is valid'
        }
    }
}

class BvnkProvider {
    crossCheck(wallet: string) {
        if (wallet.length < 8) {
            return 'satus: NULL, msg: wrong wallet'
        }
        return {
            code: 200,
            status: true
        }
    }
}

class CoinbaseAdapter implements IPaymentService {
    constructor(readonly provider: CoinbaseProvider) {
        this.provider = provider
    }
    validateWallet(wallet: string): WalletResponse {
        const response = this.provider.validateWallet(wallet);
        if (response.status) {
            return {
                success: true,
                msg: 'ok'
            }
        }
        return {
            success: false,
            msg: 'failed'
        }
    }

}

class BvnkAdapter implements IPaymentService {
    constructor(private readonly provider: BvnkProvider) { }
    validateWallet(wallet: string): WalletResponse {
        const response = this.provider.crossCheck(wallet);
        if (typeof response === 'string') {
            return {
                success: false,
                msg: 'wrong wallet'
            }
        }
        return {
            success: true,
            msg: 'correct wallet'
        }
    }
}

//* we are deelers, we have payment service
type WalletType = "COINBASE" | "BVNK";

type WalletRequest = {
    type: WalletType;
    wallet: string;
}

type WalletResponse = {
    success: boolean;
    msg: string;
}

interface IPaymentService {
    validateWallet(wallet: string): WalletResponse
}

class WalletFactory {
    private readonly walletProvider: Record<WalletType, () => IPaymentService> = {
        COINBASE: () => new CoinbaseAdapter(new CoinbaseProvider()),
        BVNK: () => new BvnkAdapter(new BvnkProvider())
    }

    build(type: WalletType): IPaymentService {
        const provider = this.walletProvider[type];
        return provider()
    }
}

class PaymentService {
    // ...
    constructor(private readonly factory: WalletFactory) { }

    validateWallet(data: WalletRequest): WalletResponse {
        const type = data.type;
        const wallet = data.wallet;
        const provider = this.factory.build(type);
        return provider.validateWallet(wallet)
    }

}
// client input
const type = 'COINBASE';
const wallet = 'CB_15678';

const paymentService = new PaymentService(new WalletFactory());
console.log(paymentService.validateWallet({ type, wallet }));


export { }
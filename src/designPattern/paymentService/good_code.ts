// we need to integrate wallet provider (coinbase, BVNK) in our payment service, we need to use validate user wallet

//* now we need to integrate BINANCE

//* mock

class COINBASE {
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

class BVNK {
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

class COINBASE_ADAPTER implements IPaymentSevice {
    constructor(readonly provider: COINBASE) {
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

class BVNK_ADAPTER implements IPaymentSevice {
    constructor(private readonly provider: BVNK) { }
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

interface IPaymentSevice {
    validateWallet(wallet: string): WalletResponse
}

const walletProvider: Record<WalletType, () => IPaymentSevice> = {
    COINBASE: () => new COINBASE_ADAPTER(new COINBASE()),
    BVNK: () => new BVNK_ADAPTER(new BVNK())
}

class WalletFactory {
    static build(type: WalletType): IPaymentSevice {
        const provider = walletProvider[type];
        return provider()
    }
}

class PaymentService {
    // ...
    static validateWallet(data: WalletRequest): WalletResponse {
        const type = data.type;
        const wallet = data.wallet;
        const provider = WalletFactory.build(type);
        return provider.validateWallet(wallet)
    }

}
// client input
const type = 'COINBASE';
const wallet = 'CB_15678';


console.log(PaymentService.validateWallet({ type, wallet }));


export { }
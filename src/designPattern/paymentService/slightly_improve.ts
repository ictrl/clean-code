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


//* we are deelers, we have payment service
type WalletType = "COINBASE" | "BNVK" | "BINANCE";

type WalletRequest = {
    type: WalletType;
    wallet: string;
}

type WalletResponse = {
    success: boolean;
    msg: string;
}

interface IPaymentSevice {
    validateWallet(data: WalletRequest): WalletResponse
}


class PaymentService implements IPaymentSevice {
    // ...
    validateWallet(data: WalletRequest): WalletResponse {
        const type = data.type;
        const wallet = data.wallet

        switch (type) {
            case "COINBASE": {
                const provider = new COINBASE();
                const res = provider.validateWallet(wallet)
                if (res.status)
                    return {
                        success: true,
                        msg: 'wallet is valid'
                    }
                else return {
                    success: false,
                    msg: 'wallet is not valid'
                }
            }
            case "BNVK":
                const provider = new BVNK();
                const res = provider.crossCheck(wallet)
                if (typeof res === 'string') {
                    return {
                        success: false,
                        msg: 'wallet is not valid'
                    }
                }
                else
                    return {
                        success: true,
                        msg: 'wallet is valid'
                    }

            default:
                return {
                    success: false,
                    msg: 'type not valid'
                }
        }
    }

}
// client input
const type = 'BNVK';
const wallet = '12345678';


const paymentService = new PaymentService();
console.log(paymentService.validateWallet({ type, wallet }));


export {}
class Coinbase {
    crossCheckWallet(wallet: string) {
        console.log('Coinbase verifying wallet', wallet);
        if (wallet.startsWith('CB') && wallet.length >= 10) {
            return 'success';
        } else {
            return 'failed'
        }
    }
}

class Binance {
    verifyWallet(wallet: string) {
        console.log('Binance verifying wallet', wallet);
        if (!wallet.startsWith('BIN') || wallet.length < 10) return false
        return true
    }
}
//* we have wallet provider with different method and return type to fix that we will use adapter design pattern with will follow contract (IWalletVerify)
//* adapter design pattern solve interfeace not compatible with another, so it warp the adaptee and convert it to desired interfact, here IWalletVerify
class CoinbaseAdapter implements IWalletVerify {
    constructor(private readonly provider: Coinbase) { }
    verify(wallet: string): boolean {
        const result = this.provider.crossCheckWallet(wallet);
        return result === 'success'
    }
}

class BinanceAdapter implements IWalletVerify {
    constructor(private readonly provider: Binance) { }
    verify(wallet: string): boolean {
        const result = this.provider.verifyWallet(wallet);
        return result
    }
}

interface IWalletVerify {
    verify(wallet: string): boolean
}

type WalletType = 'Coinbase' | 'Binance';

//* here provider is tightly couple with wallet providers
//* providers need to know about all the wallet providers
// class WalletService {
//     private provider: unknown;
//     verify(wallet: string, type: Wallets) {
//         if (type === 'Coinbase') {
//             this.provider = new Coinbase();
//         }
//         if (type === 'Binance') {
//             this.provider = new Binance()
//         }

//         if (this.provider instanceof Coinbase) return new CoinbaseAdapter(this.provider).verify(wallet)
//         if (this.provider instanceof Binance) return new BinanceAdapter(this.provider).verify(wallet)
//     }
// }

//* it decouple the service and provider
//* provide all the dependencies to the provider 
//* decide which provide to select and hide the object creation logic
// class WalletProviderFactory {
//     readonly providers: Record<WalletType, () => IWalletVerify> = {
//         'Binance': () => new BinanceAdapter(new Binance()),
//         'Coinbase': () => new CoinbaseAdapter(new Coinbase())
//     }

//     buildProvider(type: WalletType): IWalletVerify {
//         const provider = this.providers[type]
//         if (!provider) throw new Error('Unsupported wallet type ' + type)
//         return provider();
//     }
// }


//* still we need to modify providers if we need to add new provider
class WalletProviderFactory {
    // private providers: Record<any, any> = {};
    private providers = new Map<WalletType, () => IWalletVerify>();

    register(type: WalletType, provider: () => IWalletVerify) {
        this.providers.set(type, provider);
    }

    buildProvider(type: WalletType): IWalletVerify {
        const provider = this.providers.get(type);
        if (!provider) throw new Error(`Unsupported wallet type ${type}`)
        return provider()
    }
}


//* fix, we will use factory design pattern with repository class
class WalletService {
    constructor(private readonly factory: WalletProviderFactory) { }
    verify(wallet: string, type: WalletType) {
        const provider = this.factory.buildProvider(type);
        return provider.verify(wallet)
    }
}

//client code
const type = 'Coinbase';
const wallet = 'CB12345678';

const factory = new WalletProviderFactory();
factory.register('Coinbase', () => new CoinbaseAdapter(new Coinbase));
factory.register('Binance', () => new BinanceAdapter(new Binance))



const walletService = new WalletService(factory);
const isWalletValid = walletService.verify(wallet, type);
console.log(isWalletValid);


//todo need to learn strategy design pattern
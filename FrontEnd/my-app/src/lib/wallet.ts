import { LocalWallet, SmartWallet } from "@thirdweb-dev/react";

const createSmartWallet = (): SmartWallet => {
    const smartWallet = new SmartWallet({
      chain: "polygon-amoy-testnet",
      factoryAddress: "0x48000619893550507cb323cc42838f370fab1b84",
      gasless: true,
      clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
    });
    return smartWallet;
};


export async function connectSmartWallet(
    password: string,
    statusCallback: (status: string) => void
  ): Promise<SmartWallet> {
    statusCallback("Searching for trainer account...");
    const smartWallet = createSmartWallet();
    const personalWallet = new LocalWallet();
    await personalWallet.loadOrCreate({
      strategy: "encryptedJson",
      password: password,
    });
    await smartWallet.connect({
      personalWallet,
    });

    // const sdk = await ThirdwebSDK.fromWallet(smartWallet, "<chain_id>", {
    //   clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
    // });

    // const address = await sdk.wallet.getAddress();
    // const isDeployed = await isContractDeployed(address, sdk.getProvider());

    return smartWallet;
}
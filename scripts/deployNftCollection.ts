import { beginCell, toNano } from 'ton-core';
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const metadata_link = "https://chocolate-mad-carp-881.mypinata.cloud/ipfs/QmX6fM6JswHdab9MXSAx82YsexE83cWCws3WbEGGbgj4qW/"

    let content = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(metadata_link).endCell();

    let owner = provider.sender().address!;

    const nftCollection = provider.open(await NftCollection.fromInit(owner, content, {
        $$type: "RoyaltyParams",
        numerator: 350n, // 350n = 35%
        denominator: 1000n,
        destination: owner,
    }));

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(nftCollection.address);

    // run methods on `nftCollection`
}

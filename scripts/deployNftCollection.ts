import { beginCell, toNano } from 'ton-core';
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const metadata_link = "https://ivory-peaceful-xerinae-817.mypinata.cloud/ipfs/QmQfx8GsreZkQ3eXpa8MMZoYX6kYRoGgcp45bbiPUTmnki/"

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

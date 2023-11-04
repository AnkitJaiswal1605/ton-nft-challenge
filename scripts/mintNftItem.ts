import { Address, toNano } from 'ton-core';
import { NftItem } from '../wrappers/NftItem';
import { NetworkProvider } from '@ton-community/blueprint';
import { Mint, NftCollection } from '../wrappers/NftCollection';

export async function run(provider: NetworkProvider) {
    const nft_collection_address = Address.parse('EQBGzNV_-vYoyMrCmhq1r0hLAr9a7_UiP4GJ0gSM_3jq_zhP');

    const nftCollection = provider.open(NftCollection.fromAddress(nft_collection_address));
    const message: Mint = {
        $$type: 'Mint',
        query_id: 0n,
    };

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        message
    );

    const collectionData = await nftCollection.getGetCollectionData();
    const nftItemAddress = await nftCollection.getGetNftAddressByIndex(collectionData.next_item_index);

    await provider.waitForDeploy(nftItemAddress as Address);

    // run methods on `nftItem`
}
function encodeNftItem(arg0: string): import('ton-core').Cell {
    throw new Error('Function not implemented.');
}

import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'

export async function createCeramic(apiHost, seed) {
    const ceramic = new CeramicClient(apiHost || process.env.CERAMIC_ENDPOINT);
    const provider = new Ed25519Provider(seed)
    const did = new DID({ provider, resolver: getResolver() })
    await did.authenticate()
    ceramic.did = did
    return ceramic;
}

export function seedFromString(seedString) {
    const buffer = Buffer.from(seedString, 'hex'); // convert hex string to buffer
    const fixedBuffer = Buffer.alloc(32); // create new buffer with 32 bytes
    buffer.copy(fixedBuffer, 0, 0, Math.min(buffer.length, fixedBuffer.length)); // copy the bytes from the old buffer to the new buffer
    return fixedBuffer;
}

export async function sleepMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
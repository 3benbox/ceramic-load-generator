import { TileDocument } from '@ceramicnetwork/stream-tile'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { randomBytes } from "@stablelib/random";

const apiHost = 'http://k8s-ceramicl-ceramicl-c2448c12e3-997343549.us-east-1.elb.amazonaws.com'
const seed = "f01b00a249a6e306749ccce083238e082b74fbb37b28beb23656"; // 32 bytes // openssl rand -hex 26

const anchor = true
const publish = true

async function createCeramic(apiHost, seed) {
    const ceramic = new CeramicClient(apiHost || process.env.CERAMIC_ENDPOINT);
    const provider = new Ed25519Provider(seed)
    const did = new DID({ provider, resolver: getResolver() })
    await did.authenticate()
    ceramic.did = did
    return ceramic;
}

const buffer = Buffer.from(seed, 'hex'); // convert hex string to buffer
const fixedBuffer = Buffer.alloc(32); // create new buffer with 32 bytes
buffer.copy(fixedBuffer, 0, 0, Math.min(buffer.length, fixedBuffer.length)); // copy the bytes from the old buffer to the new buffer

const ceramic = await createCeramic(apiHost, fixedBuffer)

const content0 = {
    foo: `hello-${Math.random()}`,
};
const doc = await TileDocument.create(ceramic, content0, undefined, {
    anchor: anchor,
    publish: publish,
});
console.debug("ceramic payload:", doc.state);
console.log("ceramic doc id:", doc.id.toString());
console.log("--- UPDATING STREAM ---");

const content1 = {
    foo: `hello-${Math.random()}`,
};
//     await tile.update(content1, undefined, { anchor: false, publish: false });
await doc.update(content1, undefined, {
    anchor: anchor,
    publish: publish,
});
console.debug("ceramic payload:", doc.state);
console.log("ceramic doc id:", doc.id.toString());
console.log("--- UPDATED ---");


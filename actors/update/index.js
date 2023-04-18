import { TileDocument } from '@ceramicnetwork/stream-tile'
import { createCeramic, seedFromString, sleepMs } from "../createCeramic.js";

const apiHost = process.env.API_HOST;
const seedString = process.env.SEED_STRING;

if (!apiHost || !seedString) {
  throw new Error('API_HOST and SEED_STRING environment variable must be set.');
}

const anchor = process.env.ANCHOR || true;
const publish = process.env.PUBLISH || true
const sleepMSBeforeUpdate = process.env.SLEEP_MS_BEFORE_UPDATE || 1000;

const seed = seedFromString(seedString);
const ceramic = await createCeramic(apiHost, seed)

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

await sleepMs(sleepMSBeforeUpdate);

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

await sleepMs(sleepMSBeforeUpdate);

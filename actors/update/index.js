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
const updateIterations = process.env.UPDATE_ITERATIONS || 10;

const seed = seedFromString(seedString);
const ceramic = await createCeramic(apiHost, seed)

const content0 = {
    foo: `hello-${Math.random()}`,
};

function createDoc(ceramic, content0, anchor, publish) {
    return TileDocument.create(ceramic, content0, undefined, {
        anchor: anchor,
        publish: publish,
    });
}

const doc = await createDoc(ceramic, content0, anchor, publish);
console.debug("ceramic payload:", doc.state);
console.log("ceramic doc id:", doc.id.toString());
console.log("--- UPDATING STREAM ---");

await sleepMs(sleepMSBeforeUpdate);


for (let i = 1; i <= updateIterations; i++) {
    console.log(`Update Iteration ${i}`);


    const content = {
        foo: `hello-${Math.random()}`,
    };


    await doc.update(content, undefined, {
        anchor: anchor,
        publish: publish,
    });
    console.debug("ceramic payload:", doc.state);
    console.log("ceramic doc id:", doc.id.toString());
    console.log(`--- UPDATED ${i} ---`);

    await sleepMs(sleepMSBeforeUpdate);
}

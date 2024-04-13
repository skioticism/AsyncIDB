async function main() {
  const {
    processOpenDb,
    processRequest,
    processTransaction
  } = AsyncIDB;
  
  const db = await processOpenDb(window.indexedDB.open('example-db', 1), db => {
    db.createObjectStore('example-store', { autoIncrement: true });
  });

  async function printAllEntries() {
    await processTransaction(db.transaction(['example-store'], 'readonly'), async transaction => {
      const objStore = transaction.objectStore('example-store');
      const entries = await processRequest(objStore.getAll());
      for (const entry of entries) {
        console.log(entry);
      }
    });
  }
  
  async function addEntry(prop1, prop2) {
    await processTransaction(db.transaction(['example-store'], 'readwrite'), async transaction => {
      const objStore = transaction.objectStore('example-store');
      await processRequest(objStore.add({ prop1, prop2 }));
    });
  }

  await addEntry('hello', 'world');
  await addEntry(1, 2);
  await addEntry(true, false);
  await addEntry('a', 'b');

  await printAllEntries();
}
main().catch(err => console.error(err));

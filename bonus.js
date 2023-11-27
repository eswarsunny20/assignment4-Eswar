const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function findAll() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true })
      .then(client => {
        const db = client.db("company");
        const collection = db.collection('customers');
        const cursor = collection.find({}).limit(10);

        const documents = [];

        // Converting cursor.forEach to a Promise
        const forEachPromise = new Promise((innerResolve, innerReject) => {
          cursor.forEach(
            doc => documents.push(doc),
            () => innerResolve()
          );
        });

        forEachPromise.then(() => {
          client.close();
          resolve(documents);
        }).catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

setTimeout(() => {
  findAll()
    .then(docs => console.log(docs))
    .catch(err => console.error(err));
  console.log('iter');
}, 5000);

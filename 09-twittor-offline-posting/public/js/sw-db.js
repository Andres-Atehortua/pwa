// Utils to save with PouchDB

const db = new PouchDB('messages');

// Save message in DB and create new sync register
const saveMessage = (message) => {
  message._id = new Date().toISOString();
  return db.put(message).then(() => {
    self.registration.sync.register('new-message');
    const newResp = { ok: true, offline: true };

    return new Response(JSON.stringify(newResp));
  });
};

// Post messages from indexDB to DB

const postMessagesFromDBLocal = () => {
  const posts = [];
  return db.allDocs({ include_docs: true }).then((docs) => {
    docs.rows.forEach((row) => {
      const doc = row.doc;

      const fetchProm = fetch('api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      }).then(() => db.remove(doc));

      posts.push(fetchProm);
    });
    return Promise.all(posts);
  });
};

const fs = require('fs');
const urlSafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json');
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:anderson17colombia@hotmail.com',
  vapid.publicKey,
  vapid.privateKey
);

let subscriptions = require('./subs-db.json') || [];

module.exports.getKey = () => urlSafeBase64.decode(vapid.publicKey);
module.exports.addSubscription = (subscription) => {
  subscriptions.push(subscription);
  console.log(subscriptions);
  fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(subscriptions));
};

module.exports.sendPush = (post) => {
  const sendNot = [];

  subscriptions.forEach((sub, idx) => {
    const pushProm = webpush
      .sendNotification(sub, JSON.stringify(post))
      .then(console.log('Todo bien'))
      .catch((err) => {
        console.log('Notificación fallida');
        if (err.statusCode === 410) {
          // Gone ya no existe
          subscriptions[idx].delete = true;
        }
      });
    sendNot.push(pushProm);
  });

  Promise.all(sendNot).then(() => {
    subscriptions = subscriptions.filter((sub) => !sub.delete);
    fs.writeFileSync(
      `${__dirname}/subs-db.json`,
      JSON.stringify(subscriptions)
    );
  });
};

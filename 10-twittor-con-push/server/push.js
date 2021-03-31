const fs = require('fs');
const urlSafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid.json');
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:anderson17colombia@hotmail.com',
  vapid.publicKey,
  vapid.privateKey
);

const subscriptions = require('./subs-db.json') || [];

module.exports.getKey = () => urlSafeBase64.decode(vapid.publicKey);
module.exports.addSubscription = (subscription) => {
  subscriptions.push(subscription);
  console.log(subscriptions);
  fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(subscriptions));
};

module.exports.sendPush = (post) => {
  subscriptions.forEach((sub, idx) => {
    webpush.sendNotification(sub, JSON.stringify(post));
  });
};

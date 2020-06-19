'use-strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.pushNotification = functions.region('europe-west3').firestore.document("users/{user_doc}/notifications/{notification_doc}").onCreate((snapshot, context) => {
    const userDoc = context.params.user_doc;    //  Riferimento al documento del recipiente
    const notificationDoc = snapshot.data();    //  Riferimento ai dati contenuti nel documento di notifica

    return admin.firestore().collection("users").doc(userDoc).get().then(tokenResult => {
        //  Token del recipiente della notifica
        const recipientToken = tokenResult.data().token;

        //  Dati inviati nella notifica
        const payload = {
            data: {
                sender: notificationDoc.sender,
                uid: notificationDoc.uid,
                recipient: notificationDoc.recipient,
                project: notificationDoc.project,
                notificationType: notificationDoc.notificationType
            }
        };

        //  Invia la notifica all'utente con recepientToken
        return admin.messaging().sendToDevice(recipientToken, payload).then(result => {
            console.log("Notification sent to device " + recipientToken);
            return null;
        });
    });
});

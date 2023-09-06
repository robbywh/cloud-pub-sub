const { PubSub } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub({ projectId: process.env.GCP_PROJ_ID, keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const subscriptionName = "notification-sub";
const timeout = 60;

const pubsubRepository = require("../repositories/pub-sub-repo");
const { listenForPullMessages, listenForPushMessages } = pubsubRepository;


module.exports = {
    notificationsHome: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Notifications route confirmed :)",
        })
    },

    pullNotification: (req, res) => {
        try {
            console.log("PULL NOTIF")
            listenForPullMessages(pubSubClient, subscriptionName, timeout);            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Couldn't receive orders object :(",
                data: error
            })                        
        }
    },

    pushNotification: async (req, res) => {
        try {
            let messageResponse = await listenForPushMessages(req.body.message.data);
            return res.status(200).json({
                success: true,
                message: "Message received successfully :)",
                data: messageResponse
            })
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Couldn't receive orders object :(",
                data: error
            })                        
        }
    }


    

};
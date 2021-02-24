/* Magic Mirror
 * Node Helper: MMM-DailyHymn
 *
 * By Samuel Liu
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require('request');
const firebase = require('firebase');

const config = {
	apiKey: "AIzaSyD_sC-7grFUHuxyxCf5s1XoYMz1YMJ1Ioc",
	authDomain: "project-hymnal.firebaseapp.com",
	databaseURL: "https://project-hymnal.firebaseio.com",
	projectId: "project-hymnal",
	storageBucket: "project-hymnal.appspot.com",
	messagingSenderId: "76837103840",
	appId: "1:76837103840:web:ff7e3059fc5fddd634c885",
	measurementId: "G-WPTME5B7DD"
};

firebase.initializeApp(config);


module.exports = NodeHelper.create({
	// Subclass start method.
	start: function() {
		console.log("Started node_helper.js for MMM-DailyHymn.");
	},

	socketNotificationReceived: function(notification, payload) {
		console.log(this.name + " node helper received a socket notification: " + notification + " - Payload: " + payload);
		const { email, password } = payload;
		this.hymnRequest(email, password);
	},

	hymnRequest: async function(email, password) {
		var self = this;
		var credential = await firebase.auth().signInWithEmailAndPassword(email, password)
		var token = await credential.user.getIdToken()
		var url = `https://us-central1-project-hymnal.cloudfunctions.net/app/hymn`
		var headers = {
			"Authorization": "Bearer "+token
		}

		request({ url: url, method: 'GET', headers: headers }, function(error, response, body) {
			if(!error && response.statusCode == 200){
				var res = JSON.parse(response.body)
				var result = {
					hymn: res.data
				}
				self.sendSocketNotification('HYMN_RESULT', result);
			}
		});
	}
});

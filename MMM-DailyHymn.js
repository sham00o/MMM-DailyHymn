
Module.register("MMM-DailyHymn", {
    // Default module config.
    result: [],
    defaults: {
        size: 'medium',
        alignment: null,
        email: null,
        password: null,
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        var self = this;

        var credentials = { email: this.config.email, password: this.config.password }

        //Do this once first
        self.sendSocketNotification('START', credentials);

        //Then every hour
        setInterval(function() {
                self.sendSocketNotification('START', credentials);
        }, 180000); // perform every 3 minutes
    },

    getStyles: function () {
        return ["MMM-DailyHymn.css"];
    },

    getScripts: function() {
        return [
            this.file('jquery-3.1.1.min.js'), // this file will be loaded straight from the module folder.
        ]
    },

    // Override dom generator.
    getDom: function() {
        Log.log("Updating MMM-DailyHymn DOM.");

        var reference = "";
        var text = "";

        if (this.ref != null && this.text != null) {
            reference = this.ref;
            text = this.text;
        }

	      var size = this.config.size
        var alignment = this.config.alignment ? ' '+this.config.alignment : ''

        var wrapper = document.createElement("div");

        const title  = document.createElement("div");
	      title.innerHTML = reference;
        title.className = 'small' + alignment;
        wrapper.appendChild(title)

        const body  = document.createElement("div");
        body.className = 'body bright ' + size + alignment
        body.innerHTML = text;
        wrapper.appendChild(body)

        return wrapper;
      },

    socketNotificationReceived: function(notification, payload) {
        Log.log("socket received from Node Helper");
        if(notification == "HYMN_RESULT"){
            Log.log(payload);
            this.ref = payload.ref;
            this.text = payload.text;

            this.updateDom();
        }
    }
});

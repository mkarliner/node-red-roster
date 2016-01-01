 
module.exports = function(RED) {
    function Roster(config) {
        RED.nodes.createNode(this,config);
        function objarray(obj){
            keys = Object.keys(obj);
            res = [];
            for(var k = 0; k<keys.length; k++) {
                res.push(obj[keys[k]]);
            }
            return res;
        }
		this.indexProperty = config.indexProperty;
		this.timeout = config.timeout;
        var node = this;
        console.log("TJIS ", this)
        this.roster = {};

        this.on('input', function(msg) {
			var newEntry = true;
			var payload = JSON.parse(msg.payload);
			payload.rosterTimestamp = new Date();
            payload.rosterStatus = "active";
			//console.log("ROS: ", payload, roster)
			//Check for valid message
			if(!payload[node.indexProperty]) {
				node.error("Missing property " + node.indexProperty + " in incoming message", msg);
				return;
			}
			// Have we already registered this entry?
			if (this.roster[payload[node.indexProperty]]) {
				newEntry = false; 
			}
            this.roster[payload[this.indexProperty]] = payload;

			// Only send roster if it has changed.
			if(newEntry == true) {
	            node.send({payload: JSON.stringify(objarray(this.roster)) });
			}
        });
        function checkEntries(){
        			var entryDeleted = false;
        			for(var propertyName in this.roster) {
        				var entry = this.roster[propertyName];
        				var now = new Date();
        				var idle = (now-entry.rosterTimestamp)/1000;
                        //node.log("SI: ", entry, idle, propertyName)
        				if(entry.rosterTimestamp>0 && (idle > node.timeout)) {
        					//delete this.roster[propertyName];
                            this.roster[propertyName].rosterStatus = "inactive";
                            console.log("DELETED ", propertyName)
        					entryDeleted = true;
        				} 
        				//this.roster.push[this.roster[propertyName]];
        			}
        			// Only send roster if it has changed.
        			if(entryDeleted == true) {
        	            node.send({payload: JSON.stringify(objarray(this.roster)) });
        			}
        		}
		setInterval(checkEntries.bind(this), 1000)
    }
    RED.nodes.registerType("roster",Roster);
}

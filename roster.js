 
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
        this.roster = {};

        this.on('input', function(msg) {
			var newEntry = true;
			var payload = msg.payload;
			payload.rosterTimestamp = new Date();
            payload.rosterStatus = "active";
            //console.log("PL", payload)
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
	            node.send({payload: objarray(this.roster) });
			}
        });
        function checkEntries(){
        			var entryMarked = false;
        			for(var propertyName in this.roster) {
        				var entry = this.roster[propertyName];
        				var now = new Date();
        				var idle = (now-entry.rosterTimestamp)/1000;
                        //node.log("SI: ", entry, idle, propertyName)
        				if(entry.rosterTimestamp>0 && (idle > node.timeout)) {
        					//delete this.roster[propertyName];
                            this.roster[propertyName].rosterStatus = "inactive";
        					entryMarked = true;
        				} 
        				//this.roster.push[this.roster[propertyName]];
        			}
        			// Only send roster if it has changed.
        			if(entryMarked == true) {
        	            node.send({payload: objarray(this.roster) });
        			}
        		}
		setInterval(checkEntries.bind(this), 1000)
    }
    RED.nodes.registerType("roster",Roster);
}

 
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
        var roster  = {};
        this.on('input', function(msg) {
			var newEntry = true;
			var payload = JSON.parse(msg.payload);
			payload.rosterTimestamp = new Date();
			console.log("ROS: ", payload, roster)
			//Check for valid message
			if(!payload[node.indexProperty]) {
				node.error("Missing property " + node.indexProperty + " in incoming message", msg);
				return;
			}
			// Have we already registered this entry?
			if (roster[payload[node.indexProperty]]) {
				newEntry = false; 
			}
            roster[payload[this.indexProperty]] = payload;

			// Only send roster if it has changed.
			if(newEntry == true) {
	            node.send({payload: JSON.stringify(objarray(roster)) });
			}
        });
		setInterval(function(){
			var entryDeleted = false;
			for(var propertyName in roster) {
				var entry = roster[propertyName];
				var outputRoster = [];
				var now = new Date();
				var idle = (now-entry.rosterTimestamp)/1000;
				if(entry.rosterTimestamp>0 && (idle > node.timeout)) {
					delete roster[propertyName];
					entryDeleted = true;
				} 
				outputRoster.push[roster[propertyName]];
			}
			// Only send roster if it has changed.
			if(entryDeleted == true) {
	            node.send({payload: JSON.stringify(objarray(outputRoster)) });
			}
		}, 1000)
    }
    RED.nodes.registerType("roster",Roster);
}

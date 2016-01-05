#Node Red Roster Node

This node keeps a record of all unique messages to it
and outputs an array of them. 'Unique' is defined
as messages which contain a unique value of the index
specified by the configuration parameter 'indexProperty'

The node keeps a record of the last time that each unique
value was received. If the last message was less than
'timeout' seconds ago, the entry is marked as active 
otherwise it is marked as inactive.

Typically, this node is used to keep track of active
devices. Each device sends a periodic message with say,
a unique _deviceID_ to a single
MQTT topic, which forwards the messages to the roster 
node which uses _deviceID_ as its indexProperty.

The roster array can then be used to show all known
devices and their active state.


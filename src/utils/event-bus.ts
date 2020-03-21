const Util = require('util')
const EventEmitter = require('events');

function EventBus () {}

Util.inherits(EventBus,EventEmitter)

// @ts-ignore
const bus = new EventBus()

export default bus


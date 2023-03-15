export function buildEventTarget() {
    const evtlist = {};
    return [new EventTarget(evtlist), evtlist];
}

function EventTarget(evtlist) {
    this.listeners = evtlist;
};

EventTarget.prototype.addEventListener = function (type, callback) {
    if (this.self == null) {
        this.self = this;
        this.target = this;
    }
    
    if (!(type in this.self.listeners)) {
        this.self.listeners[type] = [];
    }
    this.self.listeners[type].push({ target: this.target, listener: callback });
};

EventTarget.prototype.removeEventListener = function (type, callback) {
    if (!(type in this.listeners)) {
        return;
    }
    var stack = this.listeners[type];
    for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i]['listener'] === callback) {
            stack.splice(i, 1);
            return;
        }
    }
};

EventTarget.prototype.dispatchEvent = function (event) {
    if (!(event.type in this.listeners)) {
        return true;
    }
    var stack = this.listeners[event.type].map(x => x.listener).slice();

    for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event);
    }
    return !event.defaultPrevented;
};
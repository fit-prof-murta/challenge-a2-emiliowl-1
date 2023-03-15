export function createRequest() {
    var request = null;
    try {
        request = new XMLHttpRequest();
    } catch (tryMS) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (otherMS) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (failed) {
                console.log('no way to create XMLHttpRequest object')
            }
        }
    }

    request.withLogger = withLogger.bind(request);
    return request;
}

function withLogger () {
    this.send = new Proxy(this.send, {
        apply: function (target, thisArg, args) {
            console.log('target');
            console.log(target);
            console.log('thisArg');
            console.log(typeof thisArg == "object" ? thisArg.constructor.name : typeof thisArg);
            console.log('args');
            console.log(args);
            console.log('chamando ');
            return target.bind(thisArg)(...args);
        },
    });

    return this;
}
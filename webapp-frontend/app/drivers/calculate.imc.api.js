function createRequest() {
    return new XMLHttpRequest();
}

function configureRequest(req, callback) {
    req.open("POST", "http://localhost:3000/imc/calculate");
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                callback(JSON.parse(this.responseText));
            }
        }
    }
    return req;
}

export function calculateImcAPI(person, callback) {
    let req = createRequest();
    req = configureRequest(req, callback);
    req.send(JSON.stringify({
        "height": person.height,
        "weight": person.weight
    }));
}
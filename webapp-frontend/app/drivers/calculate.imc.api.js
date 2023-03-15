import { createRequest } from '../infra/http.js';

export function calculateImcAPI(person, callback) {
    var request = createRequest().withLogger();
    if (!request) return null;
  
    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          callback(JSON.parse(this.responseText));
        }
      }
    };
    request.open('POST', 'http://localhost:3000/imc/calculate', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({
      'height': person.height,
      'weight': person.weight
    }));
  }
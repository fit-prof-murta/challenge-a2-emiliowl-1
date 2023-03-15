import { debounce } from './debounce.js';

import { calculateImcAPI } from './drivers/calculate.imc.api.js';
import { Person } from './models/domain.js';

export function calculateImc(height, weight, callback) {
    if (height == null || height == 0) return null;
    if (weight == null || weight == 0) return null;

    const PersonProxy = new Proxy(Person, {
        construct: function (target, argArray, newtarget) {
            console.log("behavior been captured before constructor...");
            console.log(target);
            console.log(argArray);
            console.log(newtarget);
            return Reflect.construct(target, argArray, newtarget);
        },
        get: function (target, prop) {
            console.log(`target obj: ${target}`);
            console.log(`called: ${prop}`);
            return Reflect.get(...arguments);
        },
        set(target, prop, value) {
            target[prop] = value;
            console.log(`property set: ${prop} = ${value}`);
            return true;
        },
    });
    return calculateImcAPI(new PersonProxy(height, weight), callback);
}

export function calculate() {
    let heightEl = document.querySelector('#altura');
    let weightEl = document.querySelector('#peso');
    let height = 0;
    let weight = 0;

    if (heightEl) height = heightEl.value;
    if (weightEl) weight = weightEl.value;

    calculateImc(height, weight, response => {
        if (response && response.imc) {
            document.querySelector("#imc").innerHTML = `${response.imc}, ${response.imcDescription}`;
        }
    });
}

export function initialize() {
    const button = document.querySelector("button.action");
    button.addEventListener("click", debounce(calculate));
}
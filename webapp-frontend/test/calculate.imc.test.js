import { JSDOM } from "jsdom";
import { expect, should } from "chai";

import { initializeAJAX } from "./helpers/ajax.js";
import { buildEventTarget } from "./helpers/events.js";
import { calculateImc, initialize } from "../app/calculate.imc.js";

should();

describe("IMC", function () {
  beforeEach(() => {
    initializeDOM();
    initializeAJAX();
  });

  describe("#calculateImc(height, weight)", function () {
    it("should return null when height is zero", function () {
      expect(calculateImc(0, 88)).to.be.null
    });
    it("should return null when height is null", function () {
      expect(calculateImc(null, 88)).to.be.null
    });

    it("should return null when weight is zero", function () {
      expect(calculateImc(1.77, 0)).to.be.null
    });
    it("should return null when weight is null", function () {
      expect(calculateImc(1.77)).to.be.null
    });

    const scenarios = [
      { 'height': 1.77, 'weight': 50, 'imc': 15.96, 'imcDescription': 'magreza' },
      { 'height': 1.77, 'weight': 60, 'imc': 19.15, 'imcDescription': 'normal' },
      { 'height': 1.77, 'weight': 80, 'imc': 25.54, 'imcDescription': 'sobrepeso' },
      { 'height': 1.77, 'weight': 100, 'imc': 31.92, 'imcDescription': 'obesidade' }
    ];

    scenarios.forEach(scenario => {
      it(`should return ${scenario.imc} when height is ${scenario.height} and weight is ${scenario.weight}`, function (done) {
        global.server.respondWith([
          200,
          { "Content-Type": "application/json" },
          JSON.stringify(scenario)
        ]);

        calculateImc(scenario.height, scenario.weight, (p) => {
          expect(p['imc']).to.equal(scenario.imc);
          expect(p['imcDescription']).to.equal(scenario.imcDescription);
          done();
        });
      });
    });
  })
});

describe("#render", function () {
  beforeEach(() => {
    initializeDOM();
    initializeAJAX();
  });

  describe("#initialize", function () {
    it("should prepare DOM elements to implement calculate imc logic", function () {
      // arrange
      const button = document.querySelector('button.action');
      const [evtTarget, evtlist] = buildEventTarget();
      button.addEventListener = evtTarget.addEventListener.bind({ self: evtTarget, target: button });

      // act
      initialize();

      // assert
      expect(evtlist['click'].map(x => x['listener'].name)).to.contain.oneOf(['debounceFct']);
      expect(
        evtlist['click']
          .filter(x => x['listener'].name == 'debounceFct')
          .map(x => x['target'])[0]
      )
        .to.equal(document.querySelector('button.action'));
    });
  });

  describe("#action", function () {
    it("should calculate IMC and fulfill the imc <span> to provide user feedback", function () {
      // arrange
      global.server.respondWith([
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({ 'height': 1.77, 'weight': 80, 'imc': 25.54, 'imcDescription': 'sobrepeso' })
      ]);

      // act
      initialize();
      document.querySelector("button.action").click();

      // assert
      expect(document.querySelector("#imc").innerHTML).to.equal("25.54, sobrepeso");
    });
  });
});

function initializeDOM() {
  const dom = new JSDOM(
    `<html>
         <body>
          <input id="altura" value="1.77" placeholder="0.00" />
          <input id="peso" value="80" placeholder="0.00" />
          <button type="button" class="action">Calcular</button>
          <div class="data">Seu IMC &eacute; <span id="imc"></span></div>
         </body>
       </html>`,
    { url: 'http://localhost' }
  );

  global.window = dom.window;
  global.document = dom.window.document;
}

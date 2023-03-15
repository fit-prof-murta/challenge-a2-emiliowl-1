import sinon from "sinon";

export function initializeAJAX() {
    global.server = sinon.fakeServer.create({
      autoRespond: true,
      respondImmediately: true
    });
    global.XMLHttpRequest = global.server.xhr;
  }
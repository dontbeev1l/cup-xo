HTMLElement.prototype.activate = function () {
    this.classList.add('active');
}

HTMLElement.prototype.deactivate = function () {
    this.classList.remove('active');
}

NodeList.prototype.forEach = function (fn) {
    Array.from(this).forEach(fn);
}

NodeList.prototype.addEventListener = function (event, listener) {
    Array.from(this).forEach(el => el.addEventListener(event, listener.bind(el)));
}

function dqsa(selector) {
    return document.querySelectorAll(selector);
}
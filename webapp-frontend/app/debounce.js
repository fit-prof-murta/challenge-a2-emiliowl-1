export function debounce(fct, timeout = 500) {
    let timer;
    return function debounceFct (...args) {
        if (!timer) {
            fct.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout)
    }
}
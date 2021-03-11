global.requestAnimationFrame = function (fn: Function) {
    fn(1);
    return 0;
};

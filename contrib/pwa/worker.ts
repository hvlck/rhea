interface Worker {
    assets: string[];
    routes: (string | RegExp)[];
}

const install = event => {
    event.waitUntil(
        caches.open("").then(function (cache) {
            return cache.addAll([""]);
        })
    );
};

self.addEventListener("start", () => {
    addEventListener("install", install);
});

interface Error {
    error: string;
}

type WorkerEmission = Error;
type WorkerEmissionType = "error";

const subscribers: Map<string, Function> = new Map();
const subscribe = (callback: Function, id: string) => {
    subscribers.set(id, callback);
    return subscribe;
};

const unsubscribe = (id: string) => {
    return subscribers.delete(id);
};

const emit = (type: WorkerEmissionType, msg: WorkerEmission) => {
    subscribers.forEach(v => {
        v.call(null, type, msg);
    });
};

const register = async (src: string) => {
    return new Promise(async (resolve, reject) => {
        if ("serviceWorker" in navigator) {
            try {
                const worker = await navigator.serviceWorker.register(src, {
                    scope: "/",
                });

                const active = await navigator.serviceWorker.ready;
                if (active.active) {
                    active.active.addEventListener("error", err =>
                        emit("error", { error: err.message } as Error)
                    );
                }

                worker.addEventListener("updatefound", () => worker.update());
                resolve(true);
            } catch (err) {
                reject(err);
            }
        }
    });
};

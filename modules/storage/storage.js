class Storage {
    /**
     * 
     * @param {*} structure - keys with default values 
     */
    constructor(structure, events) {
        if (!events) {
            events = {};
        }
        this.events = events;
        this.data = {};
        Object.keys(structure).forEach(key => {
            const storageValue = localStorage.getItem(`STORAGE__${key}`);
            if (!storageValue && storageValue !== false) {
                this.set(key, structure[key]);
                return;
            }
            try {
                this.data[key] = JSON.parse(storageValue)
            } catch (e) {
                this.set(key, structure[key]);
            }
        });

        this.data = new Proxy(this.data, {
            set: (target, key, value) => {
                localStorage.setItem(`STORAGE__${key}`, JSON.stringify(value));
                if (this.events[key]) {
                    this.events[key](value);
                }
            }
        })

        Object.entries(events).forEach(([key, lstener]) => lstener(this.data[key]));
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        localStorage.setItem(`STORAGE__${key}`, JSON.stringify(value));
        this.data[key] = value;
        if (this.events[key]) {
            this.events[key](value);
        }
    }
}
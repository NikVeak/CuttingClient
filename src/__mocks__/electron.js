export const ipcRenderer = {
    events: {},
    on(event, data) {
        this.events[event](event, data);
    },
    send(event) {
        this.events[event](event);
    },
    removeAllListeners(event) {
        this.events[event] = undefined;
    }
};
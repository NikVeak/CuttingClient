const ipcRenderer = {
    // Mock implementation for 'on' method
    on: jest.fn(),

    // Mock implementation for 'send' method
    send: jest.fn(),

    // Add any other necessary mock implementations here
};

module.exports = {
    ipcRenderer,
};
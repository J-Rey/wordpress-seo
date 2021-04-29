module.exports = { 
    verbose: true,
    preset: "jest-puppeteer",
    transform: {
        "\\.js$": ['babel-jest', {rootMode: "upward"}]
    },
    setupFilesAfterEnv: ['./jest.setup.js']
};
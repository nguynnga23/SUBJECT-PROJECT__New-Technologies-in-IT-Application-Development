module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(test|Test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};

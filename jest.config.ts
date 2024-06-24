require('dotenv').config({ path: '.env.test' });

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(axios|@nestjs|cache-manager|class-transformer|class-validator))',
    ],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
            diagnostics: false,
        },
    },
    coveragePathIgnorePatterns: [
        'src/auth/jwt-auth.guard.ts'
    ],
};

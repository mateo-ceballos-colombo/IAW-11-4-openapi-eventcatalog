export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  }
};

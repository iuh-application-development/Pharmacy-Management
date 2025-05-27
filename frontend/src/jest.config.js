jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    text: jest.fn(),
    addImage: jest.fn(),
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    rect: jest.fn(),
    fromHTML: jest.fn(),
    output: jest.fn(),
  }));
});

jest.mock('html2canvas', () => () =>
  Promise.resolve(document.createElement('canvas')));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

export default {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(gsap|recharts|styled-components)/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

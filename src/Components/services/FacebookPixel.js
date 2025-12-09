import ReactPixel from 'react-facebook-pixel';

const options = {
  autoConfig: true, // set pixel's autoConfig
  debug: false, // enable logs
};

ReactPixel.init('768943982042290', options);

export default ReactPixel;
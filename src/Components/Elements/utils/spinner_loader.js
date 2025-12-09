import React, { useEffect, useState, useRef } from 'react';
import { ColorRing, Vortex } from  'react-loader-spinner'
function SpinnerLoader() {
  return (
    <>
      <div className='parentDisable' width="100%">
          <div className='overlay-box'>
          {/* <Vortex
  visible={true}
  height="80"
  width="80"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['#2e3192', '#2e3192', '#2e3192', '#2e3192', '#2e3192']}
/> */}
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={['#2e3192', '#2e3192', '#2e3192', '#2e3192', '#2e3192']}
            />
          </div>
        </div>
    </>
  );
}
export default SpinnerLoader;

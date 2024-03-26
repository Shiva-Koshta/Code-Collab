const reportWebVitals = (onPerfEntry) => {
  if (typeof onPerfEntry !== 'function') {
    console.warn('onPerfEntry must be a function');
    return;
  }

  import('web-vitals')
    .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const report = (metric) => {
        onPerfEntry(metric);
      };

      if (getCLS) getCLS(report);
      if (getFID) getFID(report);
      if (getFCP) getFCP(report);
      if (getLCP) getLCP(report);
      if (getTTFB) getTTFB(report);
    })
    .catch((error) => {
      console.error('Error importing web-vitals module:', error);
    });
};

export default reportWebVitals;


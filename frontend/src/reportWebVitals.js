// const reportWebVitals = onPerfEntry => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//       getCLS(onPerfEntry)
//       getFID(onPerfEntry)
//       getFCP(onPerfEntry)
//       getLCP(onPerfEntry)
//       getTTFB(onPerfEntry)
//     })
//   }
// }
const reportWebVitals = (onPerfEntry, { getCLS = () => {}, getFID = () => {}, getFCP = () => {}, getLCP = () => {}, getTTFB = () => {} } = {}) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

// export default reportWebVitals;


export default reportWebVitals;

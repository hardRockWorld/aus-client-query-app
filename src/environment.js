// export const isEmulating = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const isEmulating = false;

export const isProductionEnv = () => {
  // switch (window.location.hostname.toLowerCase()) {
  //     case 'aus-client-query-app.web.app':
  //     case "aus-client-query-app.firebaseapp.com":
  //         return true;
  // }
  // return false;
  return true;
};

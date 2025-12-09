import { toast } from 'react-toastify';

export const showToast = (type = '', message,time=3000) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: time,
      });
      break;
    case 'error':
      toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: time,
      });
      break;
    case 'warning':
      toast.warning(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: time,
      });
      break;
    default:
      toast.info(message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: time,
      });
      break;
  }
};
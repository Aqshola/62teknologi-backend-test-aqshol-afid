export const wrapperResponse = (data: any, message = "") => {
  return {
    message,
    data,
  };
};

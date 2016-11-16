export default store => next => action => {
  if (NODE_ENV === 'development') {
    console.log(action);
  }
  return next(action);
};

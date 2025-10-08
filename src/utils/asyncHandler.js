const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    res.status(500).json({ message: error.message });
    next(error);
  });
};

export default asyncHandler;


// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//     next(error);
//   }
// };

// export default asyncHandler;

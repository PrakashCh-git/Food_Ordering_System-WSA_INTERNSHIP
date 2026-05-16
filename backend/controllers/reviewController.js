const Restaurant = require("../models/restaurant");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");

// Create / Update Review  =>  POST /api/v1/eats/stores/:storeId/reviews
exports.createReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return next(new ErrorHandler("Rating and comment are required", 400));
  }

  const restaurant = await Restaurant.findById(req.params.storeId);
  if (!restaurant) return next(new ErrorHandler("Restaurant not found", 404));

  const existingIndex = restaurant.reviews.findIndex(
    (r) => r.user && r.user.toString() === req.user._id.toString()
  );

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    Comment: comment,
  };

  if (existingIndex >= 0) {
    restaurant.reviews[existingIndex] = review;
  } else {
    restaurant.reviews.push(review);
  }

  restaurant.numOfReviews = restaurant.reviews.length;
  restaurant.ratings =
    restaurant.reviews.reduce((acc, r) => acc + r.rating, 0) /
    restaurant.reviews.length;

  await restaurant.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review submitted" });
});

// Get all reviews  =>  GET /api/v1/eats/stores/:storeId/reviews
exports.getReviews = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.storeId);
  if (!restaurant) return next(new ErrorHandler("Restaurant not found", 404));

  res.status(200).json({ success: true, reviews: restaurant.reviews });
});

// Delete Review  =>  DELETE /api/v1/eats/stores/:storeId/reviews/:reviewId
exports.deleteReview = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.storeId);
  if (!restaurant) return next(new ErrorHandler("Restaurant not found", 404));

  const review = restaurant.reviews.id(req.params.reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You can only delete your own review", 403));
  }

  restaurant.reviews.pull(req.params.reviewId);
  restaurant.numOfReviews = restaurant.reviews.length;
  restaurant.ratings =
    restaurant.reviews.length > 0
      ? restaurant.reviews.reduce((acc, r) => acc + r.rating, 0) / restaurant.reviews.length
      : 0;

  await restaurant.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review deleted" });
});

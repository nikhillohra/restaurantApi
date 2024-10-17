const express = require("express");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsByProximity,
  getRestaurantsWithinRange,
} = require("../controllers/restaurantController");

const router = express.Router();

// Input validation rules for creating a restaurant
const restaurantValidationRules = [
  body("name").notEmpty().withMessage("Name is required."),
  body("description").notEmpty().withMessage("Description is required."),
  body("location.type")
    .equals("Point")
    .withMessage("Location type must be 'Point'."),
  body("location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be an array with exactly 2 values."),
  body("ratings").isArray().optional().withMessage("Ratings must be an array."),
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// CRUD Routes
router.post(
  "/",
  authMiddleware,
  restaurantValidationRules,
  validate,
  createRestaurant
);
router.get("/", authMiddleware, getAllRestaurants);
router.get("/:id", authMiddleware, getRestaurantById);
router.put(
  "/:id",
  authMiddleware,
  restaurantValidationRules,
  validate,
  updateRestaurant
);
router.delete("/:id", authMiddleware, deleteRestaurant);

// Proximity & Range Routes
router.post("/proximity", getRestaurantsByProximity);
router.post("/range", getRestaurantsWithinRange);

module.exports = router;

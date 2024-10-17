const Restaurant = require("../models/Restaurant");

//Create new Restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Restaurants with Pagination
exports.getAllRestaurants = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = Math.max(1, parseInt(page));
  const pageLimit = Math.max(1, parseInt(limit));

  try {
    const total = await Restaurant.countDocuments();
    const totalPages = Math.ceil(total / pageLimit);

    // If the requested page exceeds total pages
    if (pageNumber > totalPages) {
      return res.status(404).json({
        message: `Page ${pageNumber} does not exist. There are only ${totalPages} pages available.`,
        total,
        totalPages,
      });
    }

    const restaurants = await Restaurant.find()
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    res.status(200).json({
      total,
      page: pageNumber,
      limit: pageLimit,
      totalPages,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Restaurant by ID
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Restaurant by ID
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get Restaurants by Proximity
exports.getRestaurantsByProximity = async (req, res) => {
  const { latitude, longitude, radius } = req.body;

  if (!latitude || !longitude || !radius) {
    return res
      .status(400)
      .json({ message: "Latitude, longitude, and radius are required." });
  }

  try {
    const RADIUS_IN_RADIANS = radius / 6378100;

    const restaurants = await Restaurant.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], RADIUS_IN_RADIANS],
        },
      },
    });

    if (restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurants found within the specified radius." });
    }

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get restaurant Within Range
exports.getRestaurantsWithinRange = async (req, res) => {
  const { latitude, longitude, minDistance = 0, maxDistance = 5000 } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Latitude and longitude are required.",
    });
  }

  try {
    const restaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          minDistance,
          maxDistance,
          spherical: true,
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings" },
          noOfRatings: { $size: "$ratings" },
        },
      },
    ]);

    if (restaurants.length === 0) {
      return res.status(404).json({
        message:
          "No restaurants found within the specified range. Try increasing the search radius.",
      });
    }

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

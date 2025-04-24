const mongoose = require("mongoose")

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true })

const Favorite = mongoose.model("Favorite", favoriteSchema)

module.exports = Favorite

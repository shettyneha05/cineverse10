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
  title: {
    type: String,
    required: true,
  },
  poster_path: String,
  release_date: String,
  overview: String,
  vote_average: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true })

const Favorite = mongoose.model("Favorite", favoriteSchema)

module.exports = Favorite

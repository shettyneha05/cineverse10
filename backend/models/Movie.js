const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
    unique: true,
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

const Movie = mongoose.model("Movie", movieSchema)

module.exports = Movie

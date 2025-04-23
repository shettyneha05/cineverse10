const mongoose = require("mongoose")

const watchListSchema = new mongoose.Schema({
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

watchListSchema.index({ userId: 1, movieId: 1 }, { unique: true })

const WatchList = mongoose.model("WatchList", watchListSchema)

module.exports = WatchList

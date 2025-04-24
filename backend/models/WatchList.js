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
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

watchListSchema.index({ userId: 1, movieId: 1 }, { unique: true })

const WatchList = mongoose.model("WatchList", watchListSchema)

module.exports = WatchList

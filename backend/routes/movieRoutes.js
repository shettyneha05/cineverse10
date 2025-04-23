const express = require("express")
const auth = require("../middleware/auth")
const Favorite = require("../models/Favorite")
const WatchList = require("../models/WatchList")

const router = express.Router()

router.get("/favorites", auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error: error.message })
  }
})

router.post("/favorites", auth, async (req, res) => {
  try {
    const { movieId, title, poster_path, release_date, overview, vote_average } = req.body

    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
      movieId,
    })

    if (existingFavorite) {
      return res.status(400).json({ message: "Movie already in favorites" })
    }

    const favorite = new Favorite({
      userId: req.user._id,
      movieId,
      title,
      poster_path,
      release_date,
      overview,
      vote_average,
    })

    await favorite.save()
    res.status(201).json({ message: "Added to favorites", favorite })
  } catch (error) {
    res.status(500).json({ message: "Error adding to favorites", error: error.message })
  }
})

router.delete("/favorites/:movieId", auth, async (req, res) => {
  try {
    const { movieId } = req.params

    const result = await Favorite.findOneAndDelete({
      userId: req.user._id,
      movieId: Number(movieId),
    })

    if (!result) {
      return res.status(404).json({ message: "Favorite not found" })
    }

    res.json({ message: "Removed from favorites" })
  } catch (error) {
    res.status(500).json({ message: "Error removing from favorites", error: error.message })
  }
})

router.get("/watchlist", auth, async (req, res) => {
  try {
    const watchlist = await WatchList.find({ userId: req.user._id }).sort({ addedAt: -1 })
    res.json(watchlist)
  } catch (error) {
    res.status(500).json({ message: "Error fetching watchlist", error: error.message })
  }
})

router.post("/watchlist", auth, async (req, res) => {
  try {
    const { movieId, title, poster_path, release_date, overview, vote_average } = req.body

    const existingItem = await WatchList.findOne({
      userId: req.user._id,
      movieId,
    })

    if (existingItem) {
      return res.status(400).json({ message: "Movie already in watchlist" })
    }

    const watchlistItem = new WatchList({
      userId: req.user._id,
      movieId,
      title,
      poster_path,
      release_date,
      overview,
      vote_average,
    })

    await watchlistItem.save()
    res.status(201).json({ message: "Added to watchlist", watchlistItem })
  } catch (error) {
    res.status(500).json({ message: "Error adding to watchlist", error: error.message })
  }
})

router.delete("/watchlist/:movieId", auth, async (req, res) => {
  try {
    const { movieId } = req.params

    const result = await WatchList.findOneAndDelete({
      userId: req.user._id,
      movieId: Number(movieId),
    })

    if (!result) {
      return res.status(404).json({ message: "Watchlist item not found" })
    }

    res.json({ message: "Removed from watchlist" })
  } catch (error) {
    res.status(500).json({ message: "Error removing from watchlist", error: error.message })
  }
})

router.get("/status/:movieId", auth, async (req, res) => {
  try {
    const { movieId } = req.params

    const favorite = await Favorite.findOne({
      userId: req.user._id,
      movieId: Number(movieId),
    })

    const watchlist = await WatchList.findOne({
      userId: req.user._id,
      movieId: Number(movieId),
    })

    res.json({
      inFavorites: !!favorite,
      inWatchlist: !!watchlist,
    })
  } catch (error) {
    res.status(500).json({ message: "Error checking movie status", error: error.message })
  }
})

module.exports = router

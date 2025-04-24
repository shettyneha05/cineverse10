const express = require("express")
const auth = require("../middleware/auth")
const Favorite = require("../models/Favorite")
const WatchList = require("../models/WatchList")
const Movie = require("../models/Movie")

const router = express.Router()

const findOrCreateMovie = async (movieData) => {
  const { movieId, title, poster_path, release_date, overview, vote_average } = movieData

  let movie = await Movie.findOne({ movieId })

  if (!movie) {
    movie = new Movie({
      movieId,
      title,
      poster_path,
      release_date,
      overview,
      vote_average,
    })
    await movie.save()
  }

  return movie
}

router.get("/favorites", auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).populate("movie").sort({ createdAt: -1 })

    const transformedFavorites = favorites.map((fav) => ({
      _id: fav._id,
      userId: fav.userId,
      movieId: fav.movieId,
      title: fav.movie.title,
      poster_path: fav.movie.poster_path,
      release_date: fav.movie.release_date,
      overview: fav.movie.overview,
      vote_average: fav.movie.vote_average,
      createdAt: fav.createdAt,
    }))

    res.json(transformedFavorites)
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

    const movie = await findOrCreateMovie({
      movieId,
      title,
      poster_path,
      release_date,
      overview,
      vote_average,
    })

    const favorite = new Favorite({
      userId: req.user._id,
      movieId,
      movie: movie._id,
    })

    await favorite.save()

    const populatedFavorite = await Favorite.findById(favorite._id).populate("movie")

    const favoriteResponse = {
      _id: populatedFavorite._id,
      userId: populatedFavorite.userId,
      movieId: populatedFavorite.movieId,
      title: populatedFavorite.movie.title,
      poster_path: populatedFavorite.movie.poster_path,
      release_date: populatedFavorite.movie.release_date,
      overview: populatedFavorite.movie.overview,
      vote_average: populatedFavorite.movie.vote_average,
      createdAt: populatedFavorite.createdAt,
    }

    res.status(201).json({ message: "Added to favorites", favorite: favoriteResponse })
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
    const watchlist = await WatchList.find({ userId: req.user._id }).populate("movie").sort({ addedAt: -1 })

    const transformedWatchlist = watchlist.map((item) => ({
      _id: item._id,
      userId: item.userId,
      movieId: item.movieId,
      title: item.movie.title,
      poster_path: item.movie.poster_path,
      release_date: item.movie.release_date,
      overview: item.movie.overview,
      vote_average: item.movie.vote_average,
      addedAt: item.addedAt,
    }))

    res.json(transformedWatchlist)
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

    // Find or create the movie
    const movie = await findOrCreateMovie({
      movieId,
      title,
      poster_path,
      release_date,
      overview,
      vote_average,
    })

    const watchlistItem = new WatchList({
      userId: req.user._id,
      movieId,
      movie: movie._id,
    })

    await watchlistItem.save()

    const populatedWatchlistItem = await WatchList.findById(watchlistItem._id).populate("movie")

    const watchlistResponse = {
      _id: populatedWatchlistItem._id,
      userId: populatedWatchlistItem.userId,
      movieId: populatedWatchlistItem.movieId,
      title: populatedWatchlistItem.movie.title,
      poster_path: populatedWatchlistItem.movie.poster_path,
      release_date: populatedWatchlistItem.movie.release_date,
      overview: populatedWatchlistItem.movie.overview,
      vote_average: populatedWatchlistItem.movie.vote_average,
      addedAt: populatedWatchlistItem.addedAt,
    }

    res.status(201).json({ message: "Added to watchlist", watchlistItem: watchlistResponse })
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

db = db.getSiblingDB("cineverse")

db.createCollection("users")
db.createCollection("favorites")
db.createCollection("watchlists")

db.users.createIndex({ email: 1 }, { unique: true })
db.favorites.createIndex({ userId: 1, movieId: 1 }, { unique: true })
db.watchlists.createIndex({ userId: 1, movieId: 1 }, { unique: true })

db.users.insertOne({
  name: "Test User",
  email: "test@example.com",
  password: "$2a$10$S/NgGk1CK9aXuT2v6FJP4Oe5wn6MZA/FVaHzFkVHYQoC5ZlQF16Rm",
  createdAt: new Date(),
})

console.log("MongoDB initialization completed")

const express = require("express");
const articleModel = require("../../schemas/article_schema");
const mongoose = require("mongoose")

const app = express.Router()

app.get("/", async (req, res, next) => {
    try {
        const articles = await articleModel.find()
        res.status(200).send(articles)
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.post("/", async (req, res, next) => {
    try {
        const newArticle = new articleModel(req.body)

        const { _id } = await newArticle.save()
        res.status(200).send("Created!")
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.get("/:id", async (req, res, next) => {
    try {
        const article = await articleModel.findById(req.params.id)
        if (article) {
            res.status(200).send(article)
        } else {
            res.status(404).send("Error 404, data not found")
        }

    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.put("/:id", async (req, res, next) => {
    try {
        const modifiedArticle = await articleModel.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        })
        if (modifiedArticle) {
            res.status(200).send("Data changed!")
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.delete("/:id", async (req, res, next) => {
    try {
        const DeletedArticle = await articleModel.findByIdAndDelete(req.params.id)
        if (DeletedArticle) {
            res.status(200).send("Data deleted!")
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.get("/:id/reviews", async (req, res, next) => {
    try {
        const { reviews } = await articleModel.findById(
            req.params.id,
            {
                reviews: 1,
                _id: 0
            })
        res.status(200).send(reviews)
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.post("/:id/reviews", async (req, res, next) => {
    try {

        const data = await articleModel.findById(req.params.id)
        const newReview = await req.body

        await articleModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    reviews: newReview
                }
            }
        )
        res.status(201).send("Review created!")
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.get("/:id/reviews/reviewID", async (req, res, next) => {
    try {
        const { singleReview } = await findById(
            req.params.id,
            {
                _id: 0,
                reviews: {
                    $elemMatch: {
                        _id: mongoose.Types.ObjectId(req.params.reviewID)
                    }
                }
            }
        )
        res.status(200).send(singleReview)
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.put("/:id/reviews/:reviewID", async (req, res, next) => {
    try {
        const { reviews } = await articleModel.findById(
            req.params.id,
            {
                _id: 0,
                reviews: {
                    $elemMatch: {
                        _id: mongoose.Types.ObjectId(req.params.reviewID)
                    }
                }
            }
        )

        const newReview = { ...reviews[0].toObject(), ...req.body }

        await articleModel.findByIdAndUpdate(
            {
                _id: mongoose.Types.ObjectId(req.params.id),
                "reviews._id": mongoose.Types.ObjectId(req.params.reviewID),
            },
            {
                $set: {
                    "reviews.$": newReview
                }
            }
        )
        res.status(201).send("Review modified!")
    } catch (err) {
        console.log(err)
        next(err)
    }
});
app.delete("/:id/reviews/:reviewID", async (req, res, next) => {
    try {
        const { deletedReview } = await articleModel.findByIdAndUpdate(
            mongoose.Types.ObjectId(req.params.id),
            {
                $pull: {
                    reviews: {
                        _id: mongoose.Types.ObjectId(req.params.reviewID)
                    }
                }
            }
        )
        res.status(201).send("Review deleted!").send(deletedReview)
    } catch (err) {
        console.log(err)
        next(err)
    }
});

module.exports = app
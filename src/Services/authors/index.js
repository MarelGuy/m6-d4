const express = require("express");
const authorModel = require("../../schemas/author_schema");
const mongoose = require("mongoose")

const app = express.Router()

app.get('/', async (req, res, next) => {
    try {
        const articles = await authorModel.find()
        res.status(200).send(articles)
    } catch (err) {
        next(err)
        console.log(err)
    }
});
app.get('/:id', async (req, res, next) => {
    try {
        const article = await authorModel.findById(req.params.id)
        if (article) {
            res.status(200).send(article)
        } else {
            res.status(404).send("Error 404, data not found")
        }
    } catch (err) {
        next(err)
        console.log(err)
    }
});
app.post('/', async (req, res, next) => {
    try {
        const newAuthor = new authorModel(req.body)
        const { _id } = await newAuthor.save()
        res.status(201).send("Created! Here's the id of the newly creted object: " + _id)
    } catch (err) {
        next(err)
        console.log(err)
    }
});
app.put('/:id', async (req, res, next) => {
    try {
        const modifiedAuthor = await AuthorModel.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        })
        if (modifiedAuthor) {
            res.status(200).send("Data modified!")
        } else {
            res.status(404).send("404, Author profile not found")
        }
    } catch (err) {
        next(err)
        console.log(err)
    }
});
app.delete('/:id', async (req, res, next) => {
    try {
        const DeletedArticle = await articleModel.findByIdAndDelete(req.params.id)
        if (DeletedArticle) {
            res.status(200).send("Data deleted!")
        } else {
            res.status(404).send("404, Author profile not found")
        }
    } catch (err) {
        next(err)
        console.log(err)
    }
});

module.exports = app
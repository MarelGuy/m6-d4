const { Schema, model } = require("mongoose")

const ArticleSchema = new Schema(
    {
        name: String,
        surname: String,
        timestamps: true
    }
)



module.exports = model("Article", ArticleSchema) 
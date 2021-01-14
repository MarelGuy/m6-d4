const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const app = express()
const {
    catchAll,
    unauthorized,
    forbidden,
    notFound,
    badRequestHandler,
} = require("./errorHandler");

const port = process.env.PORT

const articlesRouter = require("./Services/Articles")

app.use(cors());
const staticFolderPath = join(__dirname, "../public")
app.use(express.static(staticFolderPath))
app.use(express.json());

// 

app.use("/articles", articlesRouter)

//

app.use(unauthorized);
app.use(forbidden);
app.use(notFound);
app.use(badRequestHandler);
app.use(catchAll);

console.log(listEndpoints(app))

mongoose
    .connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(port, () => {
            console.log("Running on port", port)
        })
    )
    .catch(err => console.log(err))
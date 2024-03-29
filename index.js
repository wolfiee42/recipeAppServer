const express = require('express');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@yumsynccluster.12ajabi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

//testing whether mongodb is connected or not
const dbConnet = async () => {
    try {
        client.connect();
        console.log("DB Connected successfully!");
    } catch (error) {
        console.log(error.name, error.message);
    }
}
dbConnet();


const recipeCollection = client.db("YumSyncRecipes").collection("recipes");


app.get("/", (req, res) => {
    res.send("Recipe server is cooking.")
});

app.post('/recipes', async (req, res) => {
    const recipe = req.body;
    const result = await recipeCollection.insertOne(recipe);
    res.send(result);
});


app.get('/allrecipes', async (req, res) => {
    const { search } = req.query;

    let query = {};
    if (search) {
        query = {
            recipeName: {
                $regex: search,
                $options: "i"
            },
            instruction: {
                $regex: search,
                $options: "i"
            },
        }
    }
    const result = await recipeCollection.find(query).toArray();
    res.send(result);
});


app.get("/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const result = await recipeCollection.findOne(filter);
    res.send(result);
})

app.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await recipeCollection.deleteOne(filter);
    res.send(result);
})

app.put('/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const recipe = req.body;
    const options = { upsert: true }
    const updatedDoc = {
        $set: {
            recipeName: recipe.recipeName,
            instruction: recipe.instruction,
            recipeImage: recipe.recipeImage,
            ingridients: recipe.ingridients
        }
    }
    const result = await recipeCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

})

app.listen(port, () => {
    console.log(`Recipe server is cooking at port ${port}`);
})
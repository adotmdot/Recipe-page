import { useEffect, useState } from "react"
import RecipeCard from "../components/RecipeCard"

function Home() {

  const [searchTerm, setSearchTerm] = useState("")
  const [recipes, setRecipes] = useState([])

  const [ingredients, setIngredients] = useState("")
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [savingRecipe, setSavingRecipe] = useState(false)
  const [loading, setLoading] = useState(false)

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (!token) {
      return
    }

    fetch(
      "https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/recipes",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error("Unauthorized")
        }

        return response.json()
      })

      .then((data) => setRecipes(data))

      .catch((error) => {
        console.error(error)
      })

  }, [])


  async function generateRecipe() {

    setLoading(true)

    try {

      const response = await fetch(
        "https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/generate-recipe",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ingredients,
          }),
        }
      )

      const data = await response.json()

      setGeneratedRecipe(data)

    } catch (error) {

      console.error(error)

      alert("Failed to generate recipe.")

    }

    setLoading(false)
  }


  async function saveGeneratedRecipe() {

    setSavingRecipe(true)

    try {

      const image =
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"

      const recipeData = {
        title: generatedRecipe.title,
        image: image,
        description: generatedRecipe.description,
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        tips: generatedRecipe.tips,
      }

      await fetch(
        "https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/recipes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify(recipeData),
        }
      )

      alert("Recipe saved successfully!")

    } catch (error) {

      console.error(error)

      alert("Failed to save recipe.")

    }

    setSavingRecipe(false)
  }


  return (

    <div className="min-h-screen bg-pink-50">

      {/* HERO SECTION */}
      <section className="text-center py-20 md:py-28 px-6 bg-gradient-to-r from-purple-700 to-pink-500 text-white">

        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-6xl mx-auto">
          Discover Delicious AI-Powered Recipes
        </h2>

        <p className="text-xl max-w-3xl mx-auto mb-10">
          Search healthy meals, generate recipes with AI,
          and explore modern cooking inspiration.
        </p>

        {/* SEARCH BAR */}
        <div className="max-w-2xl mx-auto mb-8 w-full">

          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl text-black text-lg shadow-xl outline-none"
          />

        </div>

        {/* AI GENERATOR */}
        <div className="max-w-3xl mx-auto mt-10 w-full flex flex-col items-center gap-6">

          <input
            type="text"
            placeholder="Enter ingredients..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl text-black text-lg shadow-xl outline-none"
          />

          <button
            onClick={generateRecipe}
            className="bg-white text-purple-700 px-10 py-4 rounded-full font-bold hover:scale-105 transition"
          >
            {loading ? "Generating..." : "Generate AI Recipe"}
          </button>

        </div>

      </section>

      {/* AI RECIPE RESPONSE */}
      {generatedRecipe && (

        <div className="bg-white rounded-3xl shadow-xl p-10 mt-20 max-w-5xl mx-auto">

          <h3 className="text-5xl font-extrabold text-purple-700 mb-10">
            AI Generated Recipe
          </h3>

          <div className="mb-8">

            <button
              onClick={saveGeneratedRecipe}
              disabled={savingRecipe}
              className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition"
            >
              {savingRecipe ? "Saving..." : "Save Recipe"}
            </button>

          </div>

          <div className="space-y-10 text-gray-700 leading-9 text-lg">

            <div>

              <h2 className="text-4xl font-bold text-purple-700 mb-4">
                {generatedRecipe.title}
              </h2>

              <p className="text-xl text-gray-600">
                {generatedRecipe.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                <div className="bg-pink-100 p-4 rounded-2xl text-center shadow">

                  <p className="text-sm text-gray-500">
                    Cook Time
                  </p>

                  <p className="text-xl font-bold text-purple-700">
                    ⏱ {generatedRecipe.cook_time}
                  </p>

                </div>

                <div className="bg-pink-100 p-4 rounded-2xl text-center shadow">

                  <p className="text-sm text-gray-500">
                    Difficulty
                  </p>

                  <p className="text-xl font-bold text-purple-700">
                    🔥 {generatedRecipe.difficulty}
                  </p>

                </div>

                <div className="bg-pink-100 p-4 rounded-2xl text-center shadow">

                  <p className="text-sm text-gray-500">
                    Servings
                  </p>

                  <p className="text-xl font-bold text-purple-700">
                    🍽 {generatedRecipe.servings}
                  </p>

                </div>

                <div className="bg-pink-100 p-4 rounded-2xl text-center shadow">

                  <p className="text-sm text-gray-500">
                    Calories
                  </p>

                  <p className="text-xl font-bold text-purple-700">
                    🥗 {generatedRecipe.calories}
                  </p>

                </div>

              </div>

            </div>

            <div>

              <h3 className="text-3xl font-bold text-purple-700 mb-4">
                Ingredients
              </h3>

              <pre className="whitespace-pre-wrap font-sans">
                {generatedRecipe.ingredients}
              </pre>

            </div>

            <div>

              <h3 className="text-3xl font-bold text-purple-700 mb-6">
                Instructions
              </h3>

              <div className="space-y-6">

                {generatedRecipe.instructions
                  ?.split("\n")
                  .filter((step) => step.trim() !== "")
                  .map((step, index) => (

                    <div
                      key={index}
                      className="bg-pink-100 border-l-4 border-purple-500 p-6 rounded-xl shadow-sm"
                    >

                      <h4 className="text-2xl font-bold text-purple-700 mb-2">
                        Step {index + 1}
                      </h4>

                      <p>{step}</p>

                    </div>

                  ))}

              </div>

            </div>

            <div>

              <h3 className="text-3xl font-bold text-purple-700 mb-4">
                Cooking Tips
              </h3>

              <pre className="whitespace-pre-wrap font-sans">
                {generatedRecipe.tips}
              </pre>

            </div>

          </div>

        </div>

      )}

      {/* FEATURED SECTION */}
      <section className="max-w-7xl mx-auto py-20 px-6">

        <h3 className="text-4xl font-bold text-center text-purple-800 mb-14">
          Featured Recipes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">

          {filteredRecipes.map((recipe) => (

            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
            />

          ))}

        </div>

      </section>

    </div>

  )
}

export default Home
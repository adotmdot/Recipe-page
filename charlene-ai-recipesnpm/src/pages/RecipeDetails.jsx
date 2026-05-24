import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function RecipeDetails() {

  const { id } = useParams()

  const [recipe, setRecipe] = useState(null)

  useEffect(() => {

    fetch(
      "https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/recipes",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {

        const foundRecipe = data.find(
          (recipe) => recipe.id === Number(id)
        )

        setRecipe(foundRecipe)
      })
      .catch((error) => {
        console.error(error)
      })

  }, [id])

  if (!recipe) {

    return (
      <div className="text-center text-4xl font-bold py-20">
        Loading Recipe...
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-pink-50 py-20 px-6">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-[400px] object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836";
          }}
        />

        <div className="p-10">

          <h1 className="text-5xl font-bold text-purple-700 mb-6">
            {recipe.title}
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            {recipe.description}
          </p>


          <hr className="my-8" />

          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Ingredients
          </h2>

          <pre className="whitespace-pre-wrap text-lg text-gray-700 mb-10 font-sans">
            {recipe.ingredients}
          </pre>

          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Instructions
          </h2>

          <div className="space-y-6 mb-10">

            {recipe.instructions
              ?.split("\n")
              .filter(step => step.trim() !== "")
              .map((step, index) => (

                <div
                  key={index}
                  className="bg-pink-100 border-l-4 border-purple-500 p-6 rounded-xl shadow-sm"
                >

                  <h3 className="text-2xl font-bold text-purple-700 mb-2">
                    Step {index + 1}
                  </h3>

                  <p className="text-lg text-gray-700">
                    {step}
                  </p>

                </div>

            ))}

          </div>

          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Cooking Tips
          </h2>

          <pre className="whitespace-pre-wrap text-lg text-gray-700 font-sans">
            {recipe.tips}
          </pre>

        </div>

      </div>

    </div>
  )
}

export default RecipeDetails
import { useEffect, useState } from "react"

function Admin({ darkMode }) {

  const [recipes, setRecipes] = useState([])

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [tips, setTips] = useState("")


  function fetchRecipes() {

    fetch("https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/recipes")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
  }


  useEffect(() => {
    fetchRecipes()
  }, [])


  async function handleSubmit(e) {

    e.preventDefault()

    let uploadedImageUrl = image

    if (selectedFile) {

        const formData = new FormData()

        formData.append("file", selectedFile)

        const uploadResponse = await fetch(
            "https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/upload",
            {
                method: "POST",
                body: formData,
            }
        )

        const uploadData = await uploadResponse.json()

        uploadedImageUrl = uploadData.image_url
    }

    const recipeData = {
        title,
        image: uploadedImageUrl,
        description,
        ingredients,
        instructions,
        tips,
    }

    if (editingId) {

        await fetch(
            `https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/recipes/${editingId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(recipeData),
            }
        )

        setEditingId(null)

    } else {

        await fetch(
            "https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/recipes",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(recipeData),
            }
        )
    }

    setTitle("")
    setImage("")
    setDescription("")
    setIngredients("")
    setInstructions("")
    setTips("")
    setSelectedFile(null)

    fetchRecipes()
}


  function editRecipe(recipe) {

    setTitle(recipe.title)

    setImage(recipe.image)

    setDescription(recipe.description)

    setEditingId(recipe.id)
  }  


  async function deleteRecipe(id) {

    await fetch(`https://charlene-ai-backend.nicebush-7fc1af01.eastus.azurecontainerapps.io/recipes/${id}`, {
      method: "DELETE",
    })

    fetchRecipes()
  }


  return (

    <div
      className={
        darkMode
          ? "min-h-screen bg-gray-900 py-20 px-6 text-white"
          : "min-h-screen bg-pink-50 py-20 px-6 text-black"
      }
    >

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-purple-700 mb-10">
          Admin Dashboard
        </h1>


        <form
          onSubmit={handleSubmit}
          className={
            darkMode
              ? "bg-gray-800 p-8 rounded-3xl shadow-xl mb-12 space-y-6"
              : "bg-white p-8 rounded-3xl shadow-xl mb-12 space-y-6"
          }
        >

          <input
            type="text"
            placeholder="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={
              darkMode
                ? "w-full p-4 rounded-xl border bg-gray-700 text-white border-gray-600"
                : "w-full p-4 rounded-xl border bg-white text-black"
            }
            required
          />

          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className={
              darkMode
                ? "w-full p-4 rounded-2xl border mb-6 bg-gray-700 text-white border-gray-600"
                : "w-full p-4 rounded-2xl border mb-6 bg-white text-black"
            }
            />

          <textarea
              placeholder="Ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className={
                  darkMode
                  ? "w-full p-4 rounded-xl border h-32 bg-gray-700 text-white border-gray-600"
                  : "w-full p-4 rounded-xl border h-32 bg-white text-black"
              }
          />

          <textarea
              placeholder="Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className={
                  darkMode
                  ? "w-full p-4 rounded-xl border h-32 bg-gray-700 text-white border-gray-600"
                  : "w-full p-4 rounded-xl border h-32 bg-white text-black"
              }
          />

          <textarea
              placeholder="Cooking Tips"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              className={
                  darkMode
                  ? "w-full p-4 rounded-xl border h-32 bg-gray-700 text-white border-gray-600"
                  : "w-full p-4 rounded-xl border h-32 bg-white text-black"
              }
          />

          <button
            type="submit"
            className="bg-purple-700 text-white px-8 py-4 rounded-full hover:bg-purple-800 transition"
          >
            {editingId ? "Update Recipe" : "Add Recipe"}
          </button>

        </form>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {recipes.map((recipe) => (

            <div
              key={recipe.id}
              className={
                darkMode
                  ? "bg-gray-800 rounded-3xl overflow-hidden shadow-lg"
                  : "bg-white rounded-3xl overflow-hidden shadow-lg"
              }
            >

              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold text-purple-700 mb-4">
                  {recipe.title}
                </h2>

                <p className={
                     darkMode
                       ? "text-gray-300 mb-6"
                       : "text-gray-600 mb-6"
                   }>
                  {recipe.description}
                </p>


                <button
                  onClick={() => editRecipe(recipe)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition mr-4"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Admin
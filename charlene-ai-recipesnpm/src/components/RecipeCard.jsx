import { Link } from "react-router-dom"

function RecipeCard({ id, title, image, description }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">

      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover"
      />

      <div className="p-6">

        <h4 className="text-2xl font-bold text-purple-700 mb-3">
          {title}
        </h4>

        <p className="text-gray-600 mb-4">
          {description}
        </p>

        <Link
          to={`/recipe/${id}`}
          className="inline-block bg-purple-700 text-white px-5 py-2 rounded-full hover:bg-purple-800 transition"
        >
          View Recipe
        </Link>

      </div>
    </div>
  )
}

export default RecipeCard
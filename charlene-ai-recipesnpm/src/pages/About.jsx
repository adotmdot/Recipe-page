function About() {


return (
  <div className="min-h-screen bg-pink-50 py-20 px-6">

    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-12">

      <h1 className="text-5xl font-bold text-purple-700 mb-8">
        About Charlene AI Recipes
      </h1>

      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Charlene AI Recipes is a modern cooking platform powered by artificial
        intelligence that helps users discover, generate, and save delicious
        recipes personalized to their tastes.
      </p>

      <p className="text-lg text-gray-600 leading-relaxed mb-6">
        Users can create accounts, securely log in, save their own private
        recipes, and explore AI-generated meal ideas using simple ingredients.
      </p>

      <p className="text-lg text-gray-600 leading-relaxed mb-6">
        This application was built using modern full-stack technologies
        including React, FastAPI, SQLite, JWT Authentication, Tailwind CSS,
        and AI integrations.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">

        <div className="bg-pink-100 rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-purple-700 mb-3">
            AI Powered
          </h2>

          <p className="text-gray-700">
            Generate recipe ideas instantly using AI technology.
          </p>
        </div>

        <div className="bg-pink-100 rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-purple-700 mb-3">
            Personalized
          </h2>

          <p className="text-gray-700">
            Every user has their own private saved recipes and account.
          </p>
        </div>

        <div className="bg-pink-100 rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-purple-700 mb-3">
            Modern Stack
          </h2>

          <p className="text-gray-700">
            Built with scalable full-stack engineering practices.
          </p>
        </div>

      </div>

    </div>

  </div>
)

  }
export default About
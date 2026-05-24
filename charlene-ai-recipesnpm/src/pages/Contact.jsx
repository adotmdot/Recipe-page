function Contact() {

  return (

    <div className="min-h-screen bg-pink-50 py-20 px-6">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-12">

        <h1 className="text-5xl font-bold text-purple-700 mb-8">
          Contact Us
        </h1>

        <p className="text-xl text-gray-700 mb-10">
          Have questions, feedback, or recipe suggestions? We'd love to hear from you.
        </p>

        <div className="space-y-8">

          <div className="bg-pink-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">
              Email
            </h2>

            <p className="text-gray-700 text-lg">
              support@Anthonymassaquoi857@gmail.com
            </p>
          </div>

          <div className="bg-pink-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">
              Developer
            </h2>

            <p className="text-gray-700 text-lg">
              Built by Anthony Massaquoi
            </p>
          </div>

          <div className="bg-pink-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">
              Mission
            </h2>

            <p className="text-gray-700 text-lg">
              Making cooking easier, smarter, and more personalized through AI.
            </p>
          </div>

        </div>

      </div>

    </div>

  )
}

export default Contact
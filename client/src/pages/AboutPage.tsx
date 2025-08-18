export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">About Techman</h1>
      <p className="text-gray-700 mb-6">
        Techman is a next-generation startup empowering businesses and individuals with top-tier web development solutions. 
        Our flagship product, Universal Job Portal, connects recruiters and job seekers across India through modern technology and elegant user experiences.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h2>
      <p className="text-gray-600 mb-6">
        To bridge the employment gap by offering a dynamic platform for hiring, networking, and career growth—completely powered by the MERN Stack.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">What We Offer</h2>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Robust job posting and searching features</li>
        <li>Separate dashboards for recruiters and seekers</li>
        <li>Advanced filtering, application tracking, and analytics</li>
        <li>Secure, token-based authentication and user role management</li>
      </ul>
    </div>
  );
}

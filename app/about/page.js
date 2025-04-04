import Image from 'next/image';

export default function About() {
    return (
      <div className="min-h-screen py-12 px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            About BusinessPlan
          </h1>
          <p className="text-xl text-gray-300">
            Empowering entrepreneurs to create professional business plans with ease and confidence.
          </p>
        </section>
  
        {/* Mission Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
            <h2 className="text-3xl font-playfair font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              At BusinessPlan, we believe that every great business starts with a solid plan. Our mission is to democratize the business planning process by providing entrepreneurs with the tools and resources they need to create professional, comprehensive business plans. We combine cutting-edge AI technology with industry best practices to help you turn your vision into reality.
            </p>
          </div>
        </section>
  
        {/* Values Section */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-playfair font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-400">
                We constantly push the boundaries of what&apos;s possible in business planning technology.
              </p>
            </div>
  
            {/* Value 2 */}
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-400">
                We foster a supportive community of entrepreneurs and business owners.
              </p>
            </div>
  
            {/* Value 3 */}
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-400">
                We strive for excellence in everything we do, from technology to customer service.
              </p>
            </div>
          </div>
        </section>
  
        {/* Team Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-playfair font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="h-64 relative">
                <Image 
                src="/images/avatar1.jpg" 
                alt="Vihan Anand" 
                className="object-cover"
                fill={true}
                sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Vihan Anand</h3>
                <p className="text-gray-400 mb-4">CEO & Founder</p>
                <p className="text-gray-300">
                  Passionate about helping entrepreneurs succeed in their business ventures.
                </p>
              </div>
            </div>
  
            {/* Team Member 2 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="h-64 relative">
                <Image 
                src="/images/avatar2.jpg" 
                alt="Yah Kisan Patil" 
                className="object-cover"
                fill={true}
                sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Yah Kisan Patil</h3>
                <p className="text-gray-400 mb-4">Head of Design</p>
                <p className="text-gray-300">
                  Leading the development of innovative design for business planning solutions.
                </p>
              </div>
            </div>
  
            {/* Team Member 3 */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="h-64 relative">
                <Image 
                src="/images/avatar3.jpg" 
                alt="Amit Yadav" 
                className="object-cover"
                fill={true}
                sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Amit Yadav</h3>
                <p className="text-gray-400 mb-4">Backend Developer</p>
                <p className="text-gray-300">
                  Building the backend for business planning solutions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
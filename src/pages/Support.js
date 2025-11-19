import React from 'react';
import Navbar from '../components/Navbar';

const Support = () => {
  const emergencyNumbers = [
    {
      country: 'United States',
      number: '988',
      name: 'Suicide & Crisis Lifeline',
      available: '24/7',
    },
    {
      country: 'United States',
      number: '1-800-273-8255',
      name: 'National Suicide Prevention Lifeline',
      available: '24/7',
    },
    {
      country: 'United Kingdom',
      number: '116 123',
      name: 'Samaritans',
      available: '24/7',
    },
    {
      country: 'Canada',
      number: '1-833-456-4566',
      name: 'Crisis Services Canada',
      available: '24/7',
    },
    {
      country: 'Australia',
      number: '13 11 14',
      name: 'Lifeline Australia',
      available: '24/7',
    },
    {
      country: 'India',
      number: '9152987821',
      name: 'iCall',
      available: 'Mon-Sat, 10 AM - 8 PM',
    },
  ];

  const resources = [
    {
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741 for free, 24/7 crisis support',
      link: 'https://www.crisistextline.org',
    },
    {
      title: 'National Alliance on Mental Illness (NAMI)',
      description: 'Support, education, and advocacy for mental health',
      link: 'https://www.nami.org',
    },
    {
      title: 'Mental Health America',
      description: 'Resources and tools for mental health support',
      link: 'https://www.mhanational.org',
    },
    {
      title: 'BetterHelp',
      description: 'Online therapy and counseling services',
      link: 'https://www.betterhelp.com',
    },
  ];

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-calm-blue mb-6">
          Support & Emergency Help
        </h1>
        <p className="text-gray-600 mb-8">
          If you're in immediate danger or experiencing a mental health crisis,
          please contact emergency services or a crisis hotline immediately.
        </p>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
          <p className="text-red-800 font-semibold">
            ⚠️ In case of emergency, call your local emergency number (911 in
            US, 999 in UK) immediately.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-calm-blue mb-6">
            Crisis Hotlines
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {emergencyNumbers.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-calm-blue mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-2">{service.country}</p>
                <p className="text-2xl font-bold text-calm-green mb-2">
                  {service.number}
                </p>
                <p className="text-sm text-gray-500">
                  Available: {service.available}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-calm-blue mb-6">
            Additional Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-calm-blue mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-calm-blue hover:underline font-semibold"
                >
                  Visit Website →
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-calm-blue to-calm-green rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Remember</h2>
          <p className="text-lg mb-2">
            You're not alone. Reaching out for help is a sign of strength, not
            weakness.
          </p>
          <p className="text-lg">
            Your mental health matters, and there are people who want to help
            you.
          </p>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-calm-blue mb-4">
            When to Seek Immediate Help
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Thoughts of suicide or self-harm</li>
            <li>Severe panic attacks or anxiety</li>
            <li>Inability to care for yourself</li>
            <li>Hearing voices or seeing things others don't</li>
            <li>Feeling completely hopeless or trapped</li>
            <li>Substance abuse crisis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Support;



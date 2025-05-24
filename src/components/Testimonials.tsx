
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      role: "Bible Study Leader",
      text: "BibleWordle has been a fantastic addition to our youth group activities. The kids love it!",
      avatar: "😇"
    },
    {
      id: 2,
      name: "Pastor David",
      role: "Community Church",
      text: "A wonderful way to engage with Biblical terms in a fun, modern format. Highly recommended!",
      avatar: "🙏"
    },
    {
      id: 3,
      name: "Michael T.",
      role: "Sunday School Teacher",
      text: "This game has improved Biblical vocabulary and engagement in my classroom tremendously.",
      avatar: "📖"
    }
  ];

  return (
    <section className="py-12 px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="testimonial-card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 dark:bg-gray-800 dark:border dark:border-gray-700"
          >
            <div className="text-4xl mb-3">{testimonial.avatar}</div>
            <p className="mb-4 italic text-gray-600 dark:text-gray-300">"{testimonial.text}"</p>
            <div className="mt-auto">
              <h4 className="font-semibold">{testimonial.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

// import React from 'react';

// const AboutUs = () => {
//   return (
//     <div className="bg-base-200 max-w-7xl mx-auto pt-10">
//       {/* Hero / Banner Section */}
//       <div className="hero bg-primary text-primary-content py-16 mb-12 shadow-md">
//         <div className="hero-content text-center">
//           <div className="max-w-2xl">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our School</h1>
//             <p className="text-lg opacity-90">
//               Building a brighter future through excellence in education, discipline, and moral values.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 space-y-16 max-w-6xl">
//         {/* Mission & Vision Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="card bg-base-100 shadow-xl border-t-4 border-primary">
//             <div className="card-body">
//               <h2 className="card-title text-2xl text-primary mb-2">
//                 <span>🎯</span> Our Mission
//               </h2>
//               <p className="text-base-content/80 leading-relaxed">
//                 To empower students with critical thinking, ethical leadership, and academic excellence, ensuring they become responsible citizens in a rapidly changing world.
//               </p>
//             </div>
//           </div>

//           <div className="card bg-base-100 shadow-xl border-t-4 border-secondary">
//             <div className="card-body">
//               <h2 className="card-title text-2xl text-secondary mb-2">
//                 <span>👁️</span> Our Vision
//               </h2>
//               <p className="text-base-content/80 leading-relaxed">
//                 To be a premier educational institution recognized for fostering innovation, holistic development, and a passion for lifelong learning among all learners.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Principal's Message Section */}
//         <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
//           <figure className="lg:w-1/3 bg-base-300">
//             <img 
//               src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
//               alt="Principal" 
//               className="w-full h-full object-cover min-h-[280px]"
//             />
//           </figure>
//           <div className="card-body lg:w-2/3 justify-center">
//             <div className="badge badge-primary badge-outline mb-2">Message</div>
//             <h2 className="card-title text-3xl mb-2">Principal's Message</h2>
//             <p className="text-base-content/80 italic mb-4">
//               "Education is not just about learning facts, but training the mind to think. We focus on nurturing every child's unique talents and character."
//             </p>
//             <div>
//               <p className="font-bold text-lg text-primary">Dr. Alexander Wright</p>
//               <p className="text-sm text-base-content/60">Principal, ABC Model High School</p>
//             </div>
//           </div>
//         </div>

//         {/* School Statistics Section */}
//         <div>
//           <h2 className="text-3xl font-bold text-center mb-8">School at a Glance</h2>
//           <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
//             <div className="stat text-center lg:text-left">
//               <div className="stat-title">Total Students</div>
//               <div className="stat-value text-primary">1,200+</div>
//               <div className="stat-desc">Enrolled across all classes</div>
//             </div>

//             <div className="stat text-center lg:text-left">
//               <div className="stat-title">Expert Teachers</div>
//               <div className="stat-value text-secondary">45+</div>
//               <div className="stat-desc">Qualified & Experienced</div>
//             </div>

//             <div className="stat text-center lg:text-left">
//               <div className="stat-title">Academic Success</div>
//               <div className="stat-value text-accent">98.5%</div>
//               <div className="stat-desc">Pass rate in board exams</div>
//             </div>

//             <div className="stat text-center lg:text-left">
//               <div className="stat-title">Classrooms</div>
//               <div className="stat-value">30+</div>
//               <div className="stat-desc">Smart & Digitalized</div>
//             </div>
//           </div>
//         </div>

//         {/* Why Choose Us & Academic Info */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Why Choose Us */}
//           <div className="bg-base-100 p-8 rounded-2xl shadow-xl">
//             <h2 className="text-2xl font-bold mb-6 text-primary">Why Choose Us?</h2>
//             <ul className="space-y-4">
//               <li className="flex items-start gap-3">
//                 <span className="badge badge-success badge-sm mt-1">✓</span>
//                 <div>
//                   <h4 className="font-semibold">Digital Classrooms</h4>
//                   <p className="text-sm text-base-content/70">Multimedia technology for interactive learning.</p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="badge badge-success badge-sm mt-1">✓</span>
//                 <div>
//                   <h4 className="font-semibold">Modern Science & Computer Labs</h4>
//                   <p className="text-sm text-base-content/70">Fully equipped for hands-on practical training.</p>
//                 </div>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="badge badge-success badge-sm mt-1">✓</span>
//                 <div>
//                   <h4 className="font-semibold">Extracurricular Activities</h4>
//                   <p className="text-sm text-base-content/70">Sports, debate, cultural club, and scouting.</p>
//                 </div>
//               </li>
//             </ul>
//           </div>

//           {/* Academic Information */}
//           <div className="bg-base-100 p-8 rounded-2xl shadow-xl">
//             <h2 className="text-2xl font-bold mb-6 text-secondary">Academic Structure</h2>
//             <div className="space-y-4">
//               <div className="p-4 bg-base-200 rounded-lg">
//                 <h4 className="font-bold">Junior Secondary Level</h4>
//                 <p className="text-sm text-base-content/70">Class 6 to Class 8 (General Curriculum)</p>
//               </div>
//               <div className="p-4 bg-base-200 rounded-lg">
//                 <h4 className="font-bold">Secondary Level (SSC)</h4>
//                 <p className="text-sm text-base-content/70">Class 9 & 10 (Science, Humanities, Business Studies)</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;

import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-base-200 min-h-screen">
      {/* Top Banner - Integrated into page background */}
      <div className="py-12 bg-base-300 text-center border-b border-base-300">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-base-content">
            About Our School
          </h1>
          <p className="text-base-content/70 text-lg">
            Building a brighter future through excellence in education, discipline, and moral values.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12 max-w-6xl">
        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-lg border-t-4 border-primary">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary mb-2">
                <span>🎯</span> Our Mission
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                To empower students with critical thinking, ethical leadership, and academic excellence, ensuring they become responsible citizens in a rapidly changing world.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border-t-4 border-secondary">
            <div className="card-body">
              <h2 className="card-title text-2xl text-secondary mb-2">
                <span>👁️</span> Our Vision
              </h2>
              <p className="text-base-content/80 leading-relaxed">
                To be a premier educational institution recognized for fostering innovation, holistic development, and a passion for lifelong learning among all learners.
              </p>
            </div>
          </div>
        </div>

        {/* Principal's Message Section */}
        <div className="card lg:card-side bg-base-100 shadow-lg overflow-hidden">
          <figure className="lg:w-1/3 bg-base-300">
            <img 
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
              alt="Principal" 
              className="w-full h-full object-cover min-h-[260px]"
            />
          </figure>
          <div className="card-body lg:w-2/3 justify-center">
            <div className="badge badge-primary badge-outline mb-2">Message</div>
            <h2 className="card-title text-3xl mb-2">Principal's Message</h2>
            <p className="text-base-content/80 italic mb-4">
              "Education is not just about learning facts, but training the mind to think. We focus on nurturing every child's unique talents and character."
            </p>
            <div>
              <p className="font-bold text-lg text-primary">Dr. Alexander Wright</p>
              <p className="text-sm text-base-content/60">Principal, ABC Model High School</p>
            </div>
          </div>
        </div>

        {/* School Statistics Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-6">School at a Glance</h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow-lg w-full bg-base-100">
            <div className="stat text-center lg:text-left">
              <div className="stat-title">Total Students</div>
              <div className="stat-value text-primary">1,200+</div>
              <div className="stat-desc">Enrolled across all classes</div>
            </div>

            <div className="stat text-center lg:text-left">
              <div className="stat-title">Expert Teachers</div>
              <div className="stat-value text-secondary">45+</div>
              <div className="stat-desc">Qualified & Experienced</div>
            </div>

            <div className="stat text-center lg:text-left">
              <div className="stat-title">Academic Success</div>
              <div className="stat-value text-accent">98.5%</div>
              <div className="stat-desc">Pass rate in board exams</div>
            </div>

            <div className="stat text-center lg:text-left">
              <div className="stat-title">Classrooms</div>
              <div className="stat-value">30+</div>
              <div className="stat-desc">Smart & Digitalized</div>
            </div>
          </div>
        </div>

        {/* Why Choose Us & Academic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Why Choose Us */}
          <div className="bg-base-100 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-primary">Why Choose Us?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="badge badge-success badge-sm mt-1">✓</span>
                <div>
                  <h4 className="font-semibold">Digital Classrooms</h4>
                  <p className="text-sm text-base-content/70">Multimedia technology for interactive learning.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="badge badge-success badge-sm mt-1">✓</span>
                <div>
                  <h4 className="font-semibold">Modern Science & Computer Labs</h4>
                  <p className="text-sm text-base-content/70">Fully equipped for hands-on practical training.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="badge badge-success badge-sm mt-1">✓</span>
                <div>
                  <h4 className="font-semibold">Extracurricular Activities</h4>
                  <p className="text-sm text-base-content/70">Sports, debate, cultural club, and scouting.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Academic Information */}
          <div className="bg-base-100 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-secondary">Academic Structure</h2>
            <div className="space-y-4">
              <div className="p-4 bg-base-200 rounded-lg">
                <h4 className="font-bold">Junior Secondary Level</h4>
                <p className="text-sm text-base-content/70">Class 6 to Class 8 (General Curriculum)</p>
              </div>
              <div className="p-4 bg-base-200 rounded-lg">
                <h4 className="font-bold">Secondary Level (SSC)</h4>
                <p className="text-sm text-base-content/70">Class 9 & 10 (Science, Humanities, Business Studies)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
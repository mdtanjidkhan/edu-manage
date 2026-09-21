import React from 'react';

const Features = () => {
  const featureList = [
    {
      title: "Student Management",
      desc: "শিক্ষার্থীদের তথ্য, Class, Roll, Student ID সহজে সংরক্ষণ ও পরিবর্তন করার সুবিধা।",
      icon: "🎓",
      color: "border-primary text-primary"
    },
    {
      title: "Teacher Management",
      desc: "শিক্ষকদের সকল প্রোফাইল তথ্য এবং Assigned Responsibilities ম্যানেজ করার ব্যবস্থা।",
      icon: "👨‍🏫",
      color: "border-secondary text-secondary"
    },
    {
      title: "Attendance Management",
      desc: "টিচাররা প্রতিদিনের Attendance নিতে পারবে এবং Admin সহজেই তা মনিটর করতে পারবে।",
      icon: "📋",
      color: "border-accent text-accent"
    },
    {
      title: "Marks Management",
      desc: "টিচাররা বিভিন্ন পরীক্ষার Marks Input ও আপডেট করতে পারবে এবং রেজাল্ট প্রস্তুত করা যাবে।",
      icon: "📝",
      color: "border-info text-info"
    },
    {
      title: "Class Routine",
      desc: "টিচার এবং ছাত্র-ছাত্রীরা নিজেদের রুটিন এবং ক্লাসের সময়সূচী দেখতে পারবে।",
      icon: "📅",
      color: "border-success text-success"
    },
    {
      title: "Payment Management",
      desc: "Student Fees, Payment History এবং বকেয়া ট্র্যাকিং করার সুবিধা।",
      icon: "💳",
      color: "border-warning text-warning"
    },
    {
      title: "Notice & Announcement",
      desc: "স্কুলের জরুরি Notice Publish করা যাবে যা সাথে সাথে Teacher ও Student দেখতে পাবে।",
      icon: "📢",
      color: "border-error text-error"
    },
    {
      title: "Role-Based Dashboard",
      desc: "Admin, Teacher এবং Student-এর জন্য আলাদা আলাদা ডেডিকেটেড ড্যাশবোর্ড।",
      icon: "🖥️",
      color: "border-primary text-primary"
    },
    {
      title: "Authentication & Security",
      desc: "নিরাপদ Login, Session Management এবং Role-based Access Control।",
      icon: "🔒",
      color: "border-secondary text-secondary"
    },
    {
      title: "Dashboard Analytics",
      desc: "Students, Teachers, Attendance ও Payment-এর রিয়েল-টাইম Analytics ও Stat।",
      icon: "📊",
      color: "border-accent text-accent"
    }
  ];

  return (
    <div className="bg-base-200 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="badge badge-primary badge-outline mb-3 p-3 font-semibold">
            System Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">
            Powerful Features for Modern Schooling
          </h2>
          <p className="text-base-content/70">
            আমাদের সিস্টেমটি এমনভাবে তৈরি করা হয়েছে যা স্কুল পরিচালনার সব প্রক্রিয়াকে সহজ, দ্রুত ও নিরাপদ করে তোলে।
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((item, index) => (
            <div 
              key={index} 
              className={`card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 ${item.color}`}
            >
              <div className="card-body">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="card-title text-xl text-base-content">{item.title}</h3>
                <p className="text-base-content/70 text-sm leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
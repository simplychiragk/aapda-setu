import React, { useState, useEffect } from "react";

export default function EmergencyContacts() {
  const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const contacts = [
    { 
      name: "Police", 
      number: "100", 
      color: "#dc2626",
      gradient: "from-red-500 to-red-600",
      icon: "🚓",
      description: "For crimes, accidents, and general emergencies"
    },
    { 
      name: "Ambulance", 
      number: "102", 
      color: "#2563eb",
      gradient: "from-blue-500 to-blue-600", 
      icon: "🚑",
      description: "Medical emergencies and health crises"
    },
    { 
      name: "Fire Brigade", 
      number: "101", 
      color: "#f97316",
      gradient: "from-orange-500 to-orange-600",
      icon: "🚒",
      description: "Fire emergencies and rescue operations"
    },
    { 
      name: "Disaster Helpline", 
      number: "1078", 
      color: "#059669",
      gradient: "from-emerald-500 to-emerald-600",
      icon: "🆘",
      description: "Natural disasters and emergency coordination"
    },
    { 
      name: "Women Helpline", 
      number: "1091", 
      color: "#7c3aed",
      gradient: "from-violet-500 to-violet-600",
      icon: "👩",
      description: "Women safety and domestic violence support"
    },
    { 
      name: "Child Helpline", 
      number: "1098", 
      color: "#d97706",
      gradient: "from-amber-500 to-amber-600",
      icon: "👶",
      description: "Child protection and welfare services"
    },
    { 
      name: "Tourist Helpline", 
      number: "1363", 
      color: "#0ea5e9",
      gradient: "from-sky-500 to-sky-600",
      icon: "🧳",
      description: "Tourist assistance and travel emergencies"
    },
    { 
      name: "Railway Helpline", 
      number: "139", 
      color: "#8b5cf6",
      gradient: "from-purple-500 to-purple-600",
      icon: "🚂",
      description: "Railway emergencies and inquiries"
    },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.number.includes(searchTerm) ||
    contact.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleShare = async (contact) => {
    const text = `Emergency Contact: ${contact.name}\nNumber: ${contact.number}\nDescription: ${contact.description}\n— via Aapda Setu`;
    try {
      if (navigator.share) {
        await navigator.share({ title: contact.name, text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Contact details copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📞 Emergency Contacts</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Quick access to essential emergency services across India
            </p>
            <div className="mt-4 text-red-100">
              <span className="font-semibold">Hello, {username}!</span> Stay safe and prepared 🙏
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search emergency contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">In Case of Emergency</h3>
              <p className="text-red-100">Stay calm, call the appropriate number, and provide clear information about your location and situation.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-3xl font-bold text-red-600">{contacts.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available 24/7</p>
                <p className="text-3xl font-bold text-emerald-600">Yes</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🕒</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage</p>
                <p className="text-3xl font-bold text-blue-600">All India</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🇮🇳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.name}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${contact.gradient} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{contact.icon}</span>
                    </div>
                    <button
                      onClick={() => handleShare(contact)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{contact.name}</h3>
                  <div className="text-2xl font-bold">{contact.number}</div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {contact.description}
                  </p>
                  
                  <button
                    onClick={() => handleCall(contact.number)}
                    className={`w-full bg-gradient-to-r ${contact.gradient} text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group-hover:scale-105`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Important Notes */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Important Tips</h3>
              <ul className="text-amber-800 space-y-1 text-sm">
                <li>• Keep your phone charged and these numbers saved in your contacts</li>
                <li>• Provide clear information about your location and the nature of emergency</li>
                <li>• Stay calm and follow the operator's instructions</li>
                <li>• For medical emergencies, mention if the person is conscious and breathing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
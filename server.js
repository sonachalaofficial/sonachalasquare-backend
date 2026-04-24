// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const app = express(); // ✅ Make sure this is declared before any app.use()

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// const propertyRoutes = require('./routes/propertyRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// app.use('/api/properties', propertyRoutes);
// app.use('/api/admin', adminRoutes); // ✅ This must come after app is declared

// // Serve uploaded images statically


// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });
// console.log("URI =>", process.env.MONGO_URI);
// // Error handling middleware
// app.use((error, req, res, next) => {
//   console.error('Unhandled error:', error);
//   res.status(500).json({ message: 'Internal server error: ' + error.message });
// });



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ CORS FIRST (very important)
app.use(cors({
  origin: "*", // temporary (later restrict)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options('*', cors());

// ✅ Middleware
app.use(express.json());

// ✅ Test route
app.get('/', (req, res) => {
  res.send("🚀 Backend running");
});

// ✅ Routes
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Debug log
console.log("MONGO_URI =>", process.env.MONGO_URI);

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err.message });
});
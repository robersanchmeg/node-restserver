// ===============================
// Puerto
// ===============================
process.env.PORT = process.env.PORT || 3000;

// ===============================
// Entorno
// ===============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================
// Base de datos
// ===============================
process.env.URLDB = process.env.NODE_ENV == 'dev' ? 'mongodb://localhost:27017/cafe' : `mongodb+srv://strider:${process.env.MONGO_URI}@cluster0-em3uv.mongodb.net/cafe?retryWrites=true&w=majority`;
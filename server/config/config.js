// ===============================
// Puerto
// ===============================
process.env.PORT = process.env.PORT || 3000;

// ===============================
// Entorno
// ===============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================
// Vencimiento del Token
// ===============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===============================
// SEED de autentificación
// ===============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===============================
// Base de datos
// ===============================
process.env.URLDB = process.env.NODE_ENV == 'dev' ? 'mongodb://localhost:27017/cafe' : `mongodb+srv://strider:${process.env.MONGO_URI}@cluster0-em3uv.mongodb.net/cafe?retryWrites=true&w=majority`;

// ===============================
// Google Client ID
// ===============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '123146070513-mpssk2tqjs8rb05j3lgvom1svkrvoigl.apps.googleusercontent.com';
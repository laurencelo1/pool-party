import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.use(cors());
app.use(express.json());
  
app.get('/', (req, res) => {
    console.log(process.env.MONGO_URI);

    res.json({ message: 'Hello from Pool Party API!' });
});

app.listen(PORT, HOST, () => {
    console.log(`Server running on port ${PORT}`);
});

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('../client/build'));
    
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
//     });
//   }
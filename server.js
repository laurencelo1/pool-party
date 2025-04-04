import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }
  
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Pool Party API!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
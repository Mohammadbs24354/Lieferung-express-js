const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise');


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;


const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "liferung",
});

app.get("/", (req, res) => {
  res.status(200);
  res.send({
    response: [{}],
  });
});
app.get("/home", (req, res) => {
  res.status(200).send({
    response: [
      {
        Restorantname: "24 Liefer Serves",
        beschreibung: `Schnell, frisch und direkt zu dir!     
          Willkommen bei deinem schnellen und zuverlässigen Fast-Food-Lieferdienst. 
          Wir bringen dir deine Lieblingsgerichte frisch zubereitet direkt nach Hause oder ins Büro. 
          Von knusprigen Burgern über herzhafte Pizzen bis hin zu knackigen Salaten – bei uns findest du alles, was dein Herz begehrt.

          Bestelle einfach online über unsere benutzerfreundliche Webseite, wähle deine Lieblingsgerichte aus unserer vielfältigen Speisekarte und wir kümmern uns um den Rest. 
          Egal ob du Lust auf etwas Schnelles für zwischendurch oder ein vollständiges Menü hast – wir sind für dich da, wann immer der Hunger ruft!

          Schnelle Lieferung. Beste Qualität. Immer frisch.

          Dein Essen, genau so, wie du es liebst – in wenigen Klicks bei dir.`,
      },
    ],
  });
});
app.get("/about", (req, res) => {
  res.status(200).send({
    response: [
      {
        name: "Lieferdienst",
        beschreibung:
          "Wir liefern direkt zu Ihnen nach Hause! Genießen Sie eine große Auswahl an frischen Produkten. Bestellen Sie bequem online und lassen Sie uns den Rest erledigen!",
        arbeitszeiten: {
          montag_freitag: "08:00 - 20:00",
          samstag: "09:00 - 18:00",
          sonntag: "10:00 - 16:00",
        },
        lieferzonen: ["Stadtzentrum", "Nordbezirk", "Südbezirk"],
        kontakt: {
          email: "info@liefer.de",
          telefon: "+49 (0) 111111111",
        },
      },
    ],
  });
});

app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const connection = await pool.getConnection();


        try {
            // Find user in database with matching username and password
            const [rows] = await connection.query(
                'SELECT id, username FROM users WHERE username = ? AND password = ?',
                [username, password]
            );

            // Check if user exists
            if (rows.length === 0) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const user = rows[0];

            // Set cookie
            res.cookie('user_id', user.id, {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict'
            });

            // Successful login
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username
                }
            });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const connection = await pool.getConnection();

        try {
            // Find user in database with matching username and password
            const [rows] = await connection.query(
                'INSERT INTO users (username, password) VALUES (?,?);',
                [username, password]
            );

            // Successful login
            res.json({
                message: 'User created successful'
            });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("server running");
  }
});


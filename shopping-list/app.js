const express = require("express");
const app = express();
const shoppingListRoutes = require("./routes/shoppingLists");

// Middleware pro parsování JSON
app.use(express.json());

// Připojení rout
app.use("/api/shoppingLists", shoppingListRoutes);

// Ostatní middleware a nastavení serveru

// Spuštění serveru
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

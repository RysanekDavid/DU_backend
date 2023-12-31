const express = require("express");
const router = express.Router();
const shoppingListController = require("../controllers/shoppingListController");

// Získání všech nákupních seznamů
router.get("/", shoppingListController.getAllShoppingLists);

// Vytvoření nového nákupního seznamu
router.post("/", shoppingListController.createShoppingList);

// Získání konkrétního nákupního seznamu
router.get("/:listId", shoppingListController.getShoppingList);

// Přidání položky do nákupního seznamu
router.post("/:listId/items", shoppingListController.addItemToList);

// Aktualizace položky v nákupním seznamu
router.put("/:listId/items/:itemId", shoppingListController.updateItemInList);

// Smazání položky z nákupního seznamu
router.delete(
  "/:listId/items/:itemId",
  shoppingListController.removeItemFromList
);

router.delete("/:listId", shoppingListController.deleteShoppingList);

router.put("/:listId", shoppingListController.updateShoppingListName);

module.exports = router;

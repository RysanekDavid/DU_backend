// Předpokládáme, že máte model ShoppingList definovaný v `models/shoppingListModel.js`
const ShoppingList = require("../models/shoppingListModel");

exports.getAllShoppingLists = async (req, res) => {
  try {
    // Zde byste získali seznamy z databáze
    const shoppingLists = await ShoppingList.find();
    res.json(shoppingLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createShoppingList = async (req, res) => {
  try {
    // Zde byste vytvořili nový seznam v databázi
    const newShoppingList = new ShoppingList(req.body); // Předpokládá se, že req.body obsahuje potřebná data
    await newShoppingList.save();
    res.status(201).json(newShoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShoppingList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }
    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addItemToList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }
    // Předpokládáme, že req.body obsahuje 'name' a 'quantity' položky
    shoppingList.items.push(req.body);
    await shoppingList.save();
    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItemInList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }
    // Najděte položku v seznamu a aktualizujte ji
    const item = shoppingList.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.name = req.body.name || item.name;
    item.quantity = req.body.quantity || item.quantity;
    await shoppingList.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeItemFromList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }
    // Odeberte položku ze seznamu
    shoppingList.items.id(req.params.itemId).remove();
    await shoppingList.save();
    res.status(200).json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ShoppingList = require("../models/shoppingListModel");

exports.getAllShoppingLists = async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find();
    res.json(shoppingLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require('mongoose');

exports.createShoppingList = async (req, res) => {
  try {
    // Vytvoříme nový seznam s náhodným ownerId
    const newShoppingList = new ShoppingList({
      name: req.body.name,
      ownerId: new mongoose.Types.ObjectId(), 
      members: [],
      items: [],
      archived: false,
    });

    // Uložíme seznam do databáze
    await newShoppingList.save();

    // Odesílání seznamu zpět na frontend
    res.status(201).json(newShoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getShoppingList = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(req.params.listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Nákupní seznam nenalezen" });
    }
    res.json(shoppingList);
  } catch (error) {
    console.error("Chyba při načítání seznamu:", error);
    res.status(500).json({ message: "Interní chyba serveru" });
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
    const { listId, itemId } = req.params;
    const { name, quantity, inBasket } = req.body;

    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    const item = shoppingList.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.name = name || item.name;
    item.quantity = quantity || item.quantity;
    item.inBasket = inBasket !== undefined ? inBasket : item.inBasket;
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

exports.updateShoppingListName = async (req, res) => {
  try {
    const { listId } = req.params;
    const { newName } = req.body;

    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    shoppingList.name = newName || shoppingList.name;
    await shoppingList.save();

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

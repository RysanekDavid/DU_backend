const ShoppingList = require("../models/shoppingListModel");
const mongoose = require("mongoose");

exports.getAllShoppingLists = async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find();
    res.json(shoppingLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createShoppingList = async (req, res) => {
  try {
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    const newShoppingList = new ShoppingList({
      name: req.body.name.trim(),
      ownerId: new mongoose.Types.ObjectId(),
      members: [],
      items: [],
      archived: false,
    });

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
      return res.status(404).json({ message: "Nákupní seznam nenalezen" });
    }
    res.json(shoppingList);
  } catch (error) {
    console.error("Chyba při načítání seznamu:", error);
    res.status(500).json({ message: "Interní chyba serveru" });
  }
};

exports.addItemToList = async (req, res) => {
  console.log("Params:", req.params);
  const listId = req.params.listId;
  try {
    // Najdeme seznam podle ID
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    const newItem = {
      name: req.body.name,
      quantity: req.body.quantity,
      inBasket: false,
    };

    shoppingList.items.push(newItem);

    // Uložení změn do databáze
    await shoppingList.save();

    // Odeslání odpovědi
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Chyba při přidání položky do seznamu:", error);
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

exports.updateShoppingList = async (req, res) => {
  try {
    const { listId } = req.params;
    const updateData = req.body;

    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Nákupní seznam nenalezen" });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: "Interní chyba serveru" });
  }
};

exports.deleteShoppingList = async (req, res) => {
  try {
    const { listId } = req.params;
    const convertedId = new mongoose.Types.ObjectId(listId);

    const shoppingList = await ShoppingList.findById(convertedId);

    if (!shoppingList) {
      return res.status(404).json({ message: "Nákupní seznam nenalezen" });
    }

    await ShoppingList.deleteOne({ _id: convertedId });
    res.status(200).json({ message: "Nákupní seznam byl úspěšně smazán" });
  } catch (error) {
    // Přidáno zachycení chyb pro případ, že ID není platné ObjectId
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Neplatné ID formátu" });
    }
    console.error("Chyba při mazání nákupního seznamu:", error);
    res.status(500).json({ message: "Interní chyba serveru" });
  }
};

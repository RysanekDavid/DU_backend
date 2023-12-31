const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const ShoppingList = require("../../models/shoppingListModel");

describe("PUT /api/shoppingLists/:listId", () => {
  let listId;

  beforeAll(async () => {
    const shoppingList = new ShoppingList({
      name: "Nákupy",
      ownerId: new mongoose.Types.ObjectId(),
      members: [],
      items: [],
      archived: false,
    });

    const savedList = await shoppingList.save();
    listId = savedList._id.toString();
  });

  test("aktualizace názvu nákupního seznamu", async () => {
    const newName = "Týdenní Nákupy";
    const res = await request(app)
      .put(`/api/shoppingLists/${listId}`)
      .send({ newName });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", newName);

    const updatedList = await ShoppingList.findById(listId);
    expect(updatedList.name).toBe(newName);
  });

  // Smazání testovacího nákupního seznamu po testech
  afterAll(async () => {
    await ShoppingList.deleteOne({ _id: listId });
  });
});

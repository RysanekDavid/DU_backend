const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const ShoppingList = require("../../models/shoppingListModel");

describe("DELETE /api/shoppingLists/:listId", () => {
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

  test("smazání nákupního seznamu", async () => {
    const res = await request(app).delete(`/api/shoppingLists/${listId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Nákupní seznam byl úspěšně smazán"
    );

    const deletedList = await ShoppingList.findById(listId);
    expect(deletedList).toBeNull();
  });
});

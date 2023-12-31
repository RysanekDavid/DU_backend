const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const shoppingListRouter = require("../../routes/shoppingListRoute");
const ShoppingList = require("../../models/shoppingListModel");
const mongoose = require("mongoose");

const mockSave = jest.fn();
ShoppingList.prototype.save = mockSave;

const app = express();
app.use(bodyParser.json());
app.use("/shopping-list", shoppingListRouter);

describe("POST /shopping-list", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a new shopping list successfully", async () => {
    // úspěšné vytvoření
    mockSave.mockResolvedValueOnce({
      _id: new mongoose.Types.ObjectId(),
      name: "New Shopping List",
      items: [],
    });

    const response = await request(app)
      .post("/shopping-list")
      .send({ name: "New Shopping List" });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("name", "New Shopping List");
    expect(mockSave).toHaveBeenCalled();
  });

  // nebylo poskytnuto jméno seznamu
  test("returns a 400 status code when the name is not provided", async () => {
    const response = await request(app).post("/shopping-list").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(mockSave).not.toHaveBeenCalled();
  });

  //
  test("returns a 500 status code when there is a database error", async () => {
    mockSave.mockRejectedValueOnce(new Error("Database save error"));

    const response = await request(app)
      .post("/shopping-list")
      .send({ name: "New Shopping List" });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "Database save error");
    expect(mockSave).toHaveBeenCalled();
  });
});

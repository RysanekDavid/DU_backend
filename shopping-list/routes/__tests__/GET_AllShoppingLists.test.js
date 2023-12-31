const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const shoppingListRoute = require("../shoppingListRoute");
const ShoppingList = require("../../models/shoppingListModel");

const app = express();
app.use(bodyParser.json());
app.use("/shopping-list", shoppingListRoute);

jest.mock("../../models/shoppingListModel", () => {
  return {
    find: jest.fn(),
    findById: jest.fn(),
  };
});

describe("Shopping List Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / should return all shopping lists", async () => {
    ShoppingList.find.mockResolvedValue([{ name: "Test List" }]);

    const response = await request(app).get("/shopping-list");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ name: "Test List" }]);
    expect(ShoppingList.find).toHaveBeenCalledTimes(1);
  });
});

module.exports = app;

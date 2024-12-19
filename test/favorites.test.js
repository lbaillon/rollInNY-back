const request = require("supertest");
const app = require("../app");

// Test pour renvoyer la liste des places d'un utilisateur A (token: IYdYjJ3Drit4Kot6zBRrXjKFng3wlXUe)
it("GET/favorites/places/IYdYjJ3Drit4Kot6zBRrXjKFng3wlXUe", async () => {
  const res = await request(app).get("/favorites/places/IYdYjJ3Drit4Kot6zBRrXjKFng3wlXUe");

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toEqual(true);
});

// Test pour renvoyer les photos attribués à la place Columbia (_id: 6756ad48e4b746f7c24d88e9) pour l'utilisateur A (token: IYdYjJ3Drit4Kot6zBRrXjKFng3wlXUe)
it("GET/favorites/pictures/IYdYjJ3Drit4Kot6zBRrXjKFng3wlXUe/6756ad48e4b746f7c24d88e9", async () => {
  const res = await request(app).get("/favorites/pictures/IYdYjJ3Drit4Kot6zBRrXjKFng3wlXUe/6756ad48e4b746f7c24d88e9");

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toEqual(true);
});

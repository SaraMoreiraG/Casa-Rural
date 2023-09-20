const request = require("supertest");
const app = require("../app.js");

describe("Email API", () => {
  it("should send an email", async () => {
    const response = await request(app).post("/send-email").send({
      name: "John Doe",
      phone: "1234567890",
      email: "johndoe@example.com",
      message: "Hello, this is a test message.",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mensaje: "Correo electrónico enviado con éxito",
    });
  });
});

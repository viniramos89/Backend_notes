const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require ("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(request, response){
    const { email, password } = request.body

    const user = await knex("users").where({ email }).first(); // Verificação de usuário.

    if(!user) {
      throw new AppError("Email ou senha incorreto", 401);
    }

    const passwordMatched = await compare(password, user.password); // verificação de senha.

    if(!passwordMatched) {
      throw new AppError("E-mail ou senha incorreto", 401)
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({ user, token });
  }
}

module.exports = SessionsController;
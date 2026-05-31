import { AuthService } from "../services/AuthService.js";
import { toPublicUser } from "../utils/formatters.js";

export const AuthController = {
  async register(req, res) {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  },

  async login(req, res) {
    const result = await AuthService.login(req.body);
    res.json(result);
  },

  async me(req, res) {
    res.json({ user: toPublicUser(req.user) });
  },
};

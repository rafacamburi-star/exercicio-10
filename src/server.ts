// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { AppError } from "./errors/AppError";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { asyncHandler } from "./utils/asyncHandler";
import { UserRepository } from "./repositories/UserRepository";

const app = express();
const port = 3000;
const userRepo = new UserRepository();

// Middleware de logging
function logger(req: Request, _res: Response, next: NextFunction) {
  if (req.url !== "/favicon.ico") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
}

app.use(logger);
app.use(express.json());
app.use(express.static("public"));

// Função para validar CNH (11 dígitos)
function validarCNH(value: string): boolean {
  return /^\d{11}$/.test(value);
}

// Rotas de validação
app.get("/valida-cpf/:cpf", (req: Request<{ cpf: string }>, res: Response) => {
  const { cpf: cpfParam } = req.params;
  const valido = cpf.isValid(cpfParam);

  if (!valido) throw new AppError("CPF inválido!", 400);

  res.json({ cpf: cpfParam, valido, mensagem: "CPF válido!" });
});

app.get("/valida-cnpj/:cnpj", (req: Request<{ cnpj: string }>, res: Response) => {
  const { cnpj: cnpjParam } = req.params;
  const valido = cnpj.isValid(cnpjParam);

  if (!valido) throw new AppError("CNPJ inválido!", 400);

  res.json({ cnpj: cnpjParam, valido, mensagem: "CNPJ válido!" });
});

app.get("/valida-cnh/:cnh", (req: Request<{ cnh: string }>, res: Response) => {
  const { cnh: cnhParam } = req.params;
  const valido = validarCNH(cnhParam);

  if (!valido) throw new AppError("CNH inválida!", 400);

  res.json({ cnh: cnhParam, valido, mensagem: "CNH válida!" });
});

// Rotas extras
app.get("/about", (_req, res) => res.send("Esta é a página About!"));
app.get("/contact", (_req, res) => res.send("Esta é a página Contact!"));
app.get("/", (_req, res) => res.sendFile(__dirname + "/../public/index.html"));

// Rota assíncrona de teste
app.get(
  "/async-test",
  asyncHandler(async (_req, res) => {
    await new Promise((r) => setTimeout(r, 50));
    throw new AppError("Erro simulado assíncrono", 418);
  })
);

// Rotas de usuário
app.post(
  "/users",
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) throw new AppError("Name e email são obrigatórios", 400);
    const user = await userRepo.create({ name, email });
    res.status(201).json(user);
  })
);

app.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await userRepo.getAll();
    res.json(users);
  })
);

app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await userRepo.getById(Number(req.params.id));
    if (!user) throw new AppError("Usuário não encontrado", 404);
    res.json(user);
  })
);

app.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    await userRepo.delete(Number(req.params.id));
    res.status(204).send();
  })
);

// 404 centralizado
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Rota ${req.method} ${req.originalUrl} não encontrada`, 404));
});

// Middleware global de erros
app.use(errorMiddleware);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} 🚀`);
});


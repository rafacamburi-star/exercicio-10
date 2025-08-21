import express, { Request, Response, NextFunction } from "express";
import { cpf, cnpj } from "cpf-cnpj-validator";

const app = express();
const port = 3000;

// Middleware de logging
function logger(req: Request, res: Response, next: NextFunction) {
  if (req.url === "/favicon.ico") return next(); // ignora favicon
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

app.use(logger);
app.use(express.json());

// Serve arquivos estáticos da pasta public
app.use(express.static("public"));

// Função simples para validar CNH (11 dígitos)
function validarCNH(value: string): boolean {
  return /^\d{11}$/.test(value);
}

// Rotas de validação
app.get("/valida-cpf/:cpf", (req: Request<{ cpf: string }>, res: Response) => {
  const { cpf: cpfParam } = req.params;
  const valido = cpf.isValid(cpfParam);
  res.json({
    cpf: cpfParam,
    valido,
    mensagem: valido ? "CPF válido!" : "CPF inválido!"
  });
});

app.get("/valida-cnpj/:cnpj", (req: Request<{ cnpj: string }>, res: Response) => {
  const { cnpj: cnpjParam } = req.params;
  const valido = cnpj.isValid(cnpjParam);
  res.json({
    cnpj: cnpjParam,
    valido,
    mensagem: valido ? "CNPJ válido!" : "CNPJ inválido!"
  });
});

app.get("/valida-cnh/:cnh", (req: Request<{ cnh: string }>, res: Response) => {
  const { cnh: cnhParam } = req.params;
  const valido = validarCNH(cnhParam);
  res.json({
    cnh: cnhParam,
    valido,
    mensagem: valido ? "CNH válida!" : "CNH inválida!"
  });
});

// Rotas extras
app.get("/about", (req: Request, res: Response) => {
  res.send("Esta é a página About!");
});

app.get("/contact", (req: Request, res: Response) => {
  res.send("Esta é a página Contact!");
});

// Rota raiz para servir index.html
app.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/../public/index.html");
});

// Middleware 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} 🚀`);
});

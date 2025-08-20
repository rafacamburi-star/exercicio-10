import express, { Request, Response, NextFunction } from 'express';
import { cpf, cnpj } from "cpf-cnpj-validator";

const app = express();
const port = 3000;

// Função simples para validar CNH (11 dígitos)
function cnh(value: string): boolean {
  return /^\d{11}$/.test(value);
}

// Middleware de logging tipado
function logger(req: Request, res: Response, next: NextFunction): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

app.use(logger);
app.use(express.json());

// Rotas de validação
app.get('/valida-cpf/:cpf', (req: Request<{ cpf: string }>, res: Response) => {
  const { cpf: cpfParam } = req.params;
  res.json({
    cpf: cpfParam,
    valido: cpf.isValid(cpfParam),
    mensagem: cpf.isValid(cpfParam) ? "CPF válido!" : "CPF inválido!"
  });
});

app.get('/valida-cnpj/:cnpj', (req: Request<{ cnpj: string }>, res: Response) => {
  const { cnpj: cnpjParam } = req.params;
  res.json({
    cnpj: cnpjParam,
    valido: cnpj.isValid(cnpjParam),
    mensagem: cnpj.isValid(cnpjParam) ? "CNPJ válido!" : "CNPJ inválido!"
  });
});

app.get('/valida-cnh/:cnh', (req: Request<{ cnh: string }>, res: Response) => {
  const { cnh: cnhParam } = req.params;
  res.json({
    cnh: cnhParam,
    valido: cnh(cnhParam),
    mensagem: cnh(cnhParam) ? "CNH válida!" : "CNH inválida!"
  });
});

// Rotas extras
app.get('/about', (req: Request, res: Response) => {
  res.send("Esta é a página About!");
});

app.get('/contact', (req: Request, res: Response) => {
  res.send("Esta é a página Contact!");
});

app.listen(port, () => {
  console.log(`API de validação iniciada na porta ${port}`);
});

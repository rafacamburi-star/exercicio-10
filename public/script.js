// Validação CPF
async function validarCPF() {
  const cpfValue = document.getElementById("cpfInput").value;
  const res = await fetch(`/valida-cpf/${cpfValue}`);
  const data = await res.json();
  document.getElementById("cpfResult").innerText = data.mensagem;
}

// Validação CNPJ
async function validarCNPJ() {
  const cnpjValue = document.getElementById("cnpjInput").value;
  const res = await fetch(`/valida-cnpj/${cnpjValue}`);
  const data = await res.json();
  document.getElementById("cnpjResult").innerText = data.mensagem;
}

// Validação CNH
async function validarCNH() {
  const cnhValue = document.getElementById("cnhInput").value;
  const res = await fetch(`/valida-cnh/${cnhValue}`);
  const data = await res.json();
  document.getElementById("cnhResult").innerText = data.mensagem;
}


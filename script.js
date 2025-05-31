const nomeUsuario = localStorage.getItem("usuarioLogado");
const spanNome = document.getElementById("nomeUsuario");
if (spanNome) spanNome.textContent = nomeUsuario;

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

function adicionarLivro() {
  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const status = document.getElementById("status").value;

  if (!titulo || !autor) {
    alert("Preencha todos os campos.");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find(u => u.nome === nomeUsuario);

  const existe = usuario.livros.some(l => l.titulo === titulo && l.autor === autor);
  if (existe) {
    alert("Livro já cadastrado.");
    return;
  }

  usuario.livros.push({ titulo, autor, status });
  const idx = usuarios.findIndex(u => u.nome === nomeUsuario);
  usuarios[idx] = usuario;

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  renderizarLivros();
  document.getElementById("titulo").value = "";
  document.getElementById("autor").value = "";
}

function renderizarLivros() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find(u => u.nome === nomeUsuario);

  const listaLivros = document.getElementById("listaLivros");
  listaLivros.innerHTML = "";

  usuario.livros.forEach((livro, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="text" value="${livro.titulo}" id="titulo-${index}" disabled></td>
      <td><input type="text" value="${livro.autor}" id="autor-${index}" disabled></td>
      <td>
        <select id="status-${index}" disabled>
          <option value="quero ler" ${livro.status === "quero ler" ? "selected" : ""}>Quero ler</option>
          <option value="lendo" ${livro.status === "lendo" ? "selected" : ""}>Lendo</option>
          <option value="lido" ${livro.status === "lido" ? "selected" : ""}>Lido</option>
        </select>
      </td>
      <td>
        <button onclick="editarLivro(${index})" id="btnEditar-${index}">Editar</button>
        <button onclick="excluirLivro(${index})">Excluir</button>
      </td>
    `;

    listaLivros.appendChild(tr);
  });
}

window.editarLivro = function(index) {
  const titulo = document.getElementById(`titulo-${index}`);
  const autor = document.getElementById(`autor-${index}`);
  const status = document.getElementById(`status-${index}`);
  const botao = document.getElementById(`btnEditar-${index}`);

  const editando = !titulo.disabled;

  if (editando) {
    salvarEdicao(index, titulo.value, autor.value, status.value);
    titulo.disabled = true;
    autor.disabled = true;
    status.disabled = true;
    botao.textContent = "Editar";
  } else {
    titulo.disabled = false;
    autor.disabled = false;
    status.disabled = false;
    botao.textContent = "Salvar";
  }
};

function salvarEdicao(index, novoTitulo, novoAutor, novoStatus) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find(u => u.nome === nomeUsuario);
  if (!usuario) return;
  usuario.livros[index] = { titulo: novoTitulo, autor: novoAutor, status: novoStatus };
  const idx = usuarios.findIndex(u => u.nome === nomeUsuario);
  usuarios[idx] = usuario;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  renderizarLivros();
}

window.excluirLivro = function(index) {
  if (!confirm("Tem certeza que deseja excluir este livro?")) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find(u => u.nome === nomeUsuario);
  if (!usuario) return;

  usuario.livros.splice(index, 1);
  const idx = usuarios.findIndex(u => u.nome === nomeUsuario);
  usuarios[idx] = usuario;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  renderizarLivros();
};

renderizarLivros();

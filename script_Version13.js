// Usuários simulados
const USERS = [
    { usuario: 'admin', senha: '1234', nome: 'Administrador' },
    { usuario: 'saulin', senha: 'saulin123', nome: 'Saulin DUPIAUI' }
];

// LOGIN
if (document.getElementById('loginForm')) {
    if (localStorage.getItem('usuarioLogado')) {
        window.location.href = 'agenda.html';
    }
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;
        const user = USERS.find(u => u.usuario === usuario && u.senha === senha);
        if (user) {
            localStorage.setItem('usuarioLogado', JSON.stringify(user));
            window.location.href = 'agenda.html';
        } else {
            document.getElementById('loginErro').textContent = "Usuário ou senha incorretos!";
        }
    });
}

// AGENDA
if (document.getElementById('userWelcome')) {
    const user = localStorage.getItem('usuarioLogado');
    if (!user) {
        window.location.href = 'index.html';
    }
    const userObj = JSON.parse(user);
    document.getElementById('userWelcome').textContent = `Olá, ${userObj.nome}! (check-in)`;
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    });
    // Tarefas:
    function tarefasKey() { return 'tarefasAgenda_' + userObj.usuario; }
    function carregarTarefas() {
        return JSON.parse(localStorage.getItem(tarefasKey())) || [];
    }
    function salvarTarefas(tarefas) {
        localStorage.setItem(tarefasKey(), JSON.stringify(tarefas));
    }
    function renderizarTarefas() {
        const ul = document.getElementById('listaTarefas');
        ul.innerHTML = '';
        const tarefas = carregarTarefas();
        tarefas.forEach((tarefa, idx) => {
            const li = document.createElement('li');
            li.className = 'tarefa-item';
            const span = document.createElement('span');
            span.className = 'tarefa-texto' + (tarefa.concluida ? ' tarefa-concluida' : '');
            span.textContent = tarefa.texto;
            span.title = tarefa.concluida ? 'Clique para marcar como pendente' : 'Clique para marcar como concluída';
            span.addEventListener('click', function() {
                tarefas[idx].concluida = !tarefas[idx].concluida;
                salvarTarefas(tarefas);
                renderizarTarefas();
            });
            const btn = document.createElement('button');
            btn.className = 'remove-btn';
            btn.title = 'Remover tarefa';
            btn.innerHTML = '✕';
            btn.addEventListener('click', function() {
                tarefas.splice(idx, 1);
                salvarTarefas(tarefas);
                renderizarTarefas();
            });
            li.appendChild(span);
            li.appendChild(btn);
            ul.appendChild(li);
        });
    }
    function adicionarTarefa() {
        const campo = document.getElementById('novaTarefa');
        const texto = campo.value.trim();
        if (texto !== '') {
            const tarefas = carregarTarefas();
            tarefas.push({ texto: texto, concluida: false });
            salvarTarefas(tarefas);
            campo.value = '';
            campo.focus();
            renderizarTarefas();
        }
    }
    document.getElementById('adicionarTarefa').addEventListener('click', adicionarTarefa);
    document.getElementById('novaTarefa').addEventListener('keydown', function(e) {
        if (e.key === "Enter") adicionarTarefa();
    });
    renderizarTarefas();
}
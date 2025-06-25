const postsList = document.getElementById('posts-list');
const newPostBtn = document.getElementById('new-post-btn');
const formContainer = document.getElementById('form-container');
const form = document.getElementById('post-form');
const formTitle = document.getElementById('form-title');
const postIdInput = document.getElementById('post-id');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const cancelBtn = document.getElementById('cancel-btn');

// Toast padrão (canto superior-direito, 2 s)
const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

// funções curtas para sucesso / erro
const ok   = (msg) => Toast.fire({ icon: 'success', title: msg });
const erro = (msg) => Toast.fire({ icon: 'error',   title: msg });

function loadPosts() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(data => {
      postsList.innerHTML = '';
      data.forEach(post => {
        const li = document.createElement('li');

        const h3 = document.createElement('h3');
        h3.textContent = post.title;

        const p = document.createElement('p');
        p.textContent = post.body;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () =>
          editPost(post.id, post.title, post.body)
        );

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', () => deletePost(post.id));

        li.append(h3, p, editBtn, deleteBtn);
        postsList.appendChild(li);
      })
    }).catch(() => erro('Não foi possível carregar os posts.'));
}

loadPosts();

// Mostrar formulário para novo post
newPostBtn.addEventListener('click', () => {
  formTitle.innerText = 'Novo Post';
  formContainer.style.display = 'block';
  postIdInput.value = '';
  titleInput.value = '';
  bodyInput.value = '';
});

cancelBtn.addEventListener('click', () => {
  formContainer.style.display = 'none';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = postIdInput.value;
  const title = titleInput.value;
  const body = bodyInput.value;
  
  const postData = { title, body, userId: 1 };
  const url      = id
    ? `https://jsonplaceholder.typicode.com/posts/${id}`
    : 'https://jsonplaceholder.typicode.com/posts';
  const method   = id ? 'PUT' : 'POST';

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  })
    .then(() => {
      loadPosts();
      formContainer.style.display = 'none';
      ok(id ? 'Post atualizado!' : 'Post criado!');
    })
    .catch(() => erro('Ops! Não foi possível salvar.'));
});

function editPost(id, title, body) {
  formTitle.innerText = 'Editar Post';
  formContainer.style.display = 'block';
  postIdInput.value = id;
  titleInput.value = title;
  bodyInput.value = body;
}

// Excluir post
function deletePost(id) {
  Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          loadPosts();
          ok('Post excluído!');
        })
        .catch(() => erro('Não foi possível excluir.'));
    }
  });
}

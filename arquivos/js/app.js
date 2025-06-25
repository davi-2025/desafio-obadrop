const postsList = document.getElementById('posts-list');
const newPostBtn = document.getElementById('new-post-btn');
const formContainer = document.getElementById('form-container');
const form = document.getElementById('post-form');
const formTitle = document.getElementById('form-title');
const postIdInput = document.getElementById('post-id');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const cancelBtn = document.getElementById('cancel-btn');

function loadPosts() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(data => {
      postsList.innerHTML = '';
      data.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.body}</p>
          <button onclick="editPost(${post.id}, '${post.title}', '${post.body}')">Editar</button>
          <button onclick="deletePost(${post.id})">Excluir</button>
        `;
        postsList.appendChild(li);
      });
    });
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
  const postData = {
    title,
    body,
    userId: 1,
  };

  if (id) {
    // Editar
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    }).then(() => {
      loadPosts();
      formContainer.style.display = 'none';
    });
  } else {
    // Criar novo
    fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    }).then(() => {
      loadPosts();
      formContainer.style.display = 'none';
    });
  }
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
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE'
  }).then(() => {
    loadPosts();
  });
}

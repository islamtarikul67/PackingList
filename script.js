// Gestione menu a hamburger
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

hamburger.addEventListener('click', () => {
  const isOpen = sidebar.style.right === '0px';
  sidebar.style.right = isOpen ? '-250px' : '0px';
});

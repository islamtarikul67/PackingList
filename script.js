function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Messaggio inviato con successo!');
    // Qui puoi aggiungere il codice per inviare il messaggio a un server
});

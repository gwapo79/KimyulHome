window.FontAwesomeConfig = {
  autoReplaceSvg: 'nest'
};

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('general-error');
      
      if (email === 'test' && password === '1234') {
        // Successful login
        window.location.href = '../mypage/dashboard.html';
      } else {
        // Failed login
        if (errorDiv) {
          errorDiv.classList.remove('hidden');
        }
      }
    });
  }
});

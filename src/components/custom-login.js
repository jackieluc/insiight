import GoTrue from 'gotrue-js'

// Find out if we're on localhost
const isLocal = document.location.host.split(':').shift() === 'localhost'

// Instantiate the library, passing in the live API URL
// and whether it should save cookies
const auth = new GoTrue({
  APIUrl: 'https://hello-haibt-1ge4hp.netlify.com/.netlify/identity',
  setCookie: !isLocal
});

// Get the current user object, or null if no-ones logged in
const user = auth.currentUser()

// Log it for next time around
console.log(user)

const loginForm = document.querySelector('.identity-form-login')
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  auth.login(this.email.value, this.password.value, true).then(
    user => window.location.href = '/',
    error => console.error("Failed to log in: %o", error)
  )
})
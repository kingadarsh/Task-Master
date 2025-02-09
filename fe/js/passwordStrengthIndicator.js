// Get DOM elements
const passwordInput = document.getElementById('password');
const strengthBar = document.querySelector('.password-strength-bar');

// Password strength criteria
const criteria = {
    length: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumbers: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

// Function to check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Check length
    if (password.length >= criteria.length) {
        strength += 1;
    }
    
    // Check for uppercase letters
    if (criteria.hasUpperCase.test(password)) {
        strength += 1;
    }
    
    // Check for lowercase letters
    if (criteria.hasLowerCase.test(password)) {
        strength += 1;
    }
    
    // Check for numbers
    if (criteria.hasNumbers.test(password)) {
        strength += 1;
    }
    
    // Check for special characters
    if (criteria.hasSpecialChar.test(password)) {
        strength += 1;
    }
    
    return strength;
}

// Function to update the strength bar
function updateStrengthBar(strength) {
    // Remove all classes first
    strengthBar.classList.remove('weak', 'medium', 'strong');
    
    // Update the strength bar based on the score
    if (strength <= 2) {
        strengthBar.classList.add('weak');
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
}



// Add event listener for password input
passwordInput.addEventListener('input', function(e) {
    const password = e.target.value;
    const strength = checkPasswordStrength(password);
    updateStrengthBar(strength);
    
    // Update tooltip requirements
    const requirements = tooltip.querySelectorAll('li');
    requirements.forEach(req => {
        switch(req.dataset.requirement) {
            case 'length':
                req.classList.toggle('met', password.length >= criteria.length);
                break;
            case 'uppercase':
                req.classList.toggle('met', criteria.hasUpperCase.test(password));
                break;
            case 'lowercase':
                req.classList.toggle('met', criteria.hasLowerCase.test(password));
                break;
            case 'number':
                req.classList.toggle('met', criteria.hasNumbers.test(password));
                break;
            case 'special':
                req.classList.toggle('met', criteria.hasSpecialChar.test(password));
                break;
        }
    });
});
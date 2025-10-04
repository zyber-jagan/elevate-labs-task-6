
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');
    
    
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: /^.{10,500}$/
    };
    

    const errorMessages = {
        name: {
            required: 'Name is required',
            invalid: 'Name must be 2-50 characters and contain only letters and spaces',
            minLength: 'Name must be at least 2 characters long',
            maxLength: 'Name must not exceed 50 characters'
        },
        email: {
            required: 'Email is required',
            invalid: 'Please enter a valid email address',
            format: 'Email format is invalid'
        },
        message: {
            required: 'Message is required',
            minLength: 'Message must be at least 10 characters long',
            maxLength: 'Message must not exceed 500 characters'
        }
    };
    
    
    function validateName(name) {
        const errors = [];
        
        if (!name.trim()) {
            errors.push(errorMessages.name.required);
        } else {
            if (name.length < 2) {
                errors.push(errorMessages.name.minLength);
            } else if (name.length > 50) {
                errors.push(errorMessages.name.maxLength);
            } else if (!patterns.name.test(name)) {
                errors.push(errorMessages.name.invalid);
            }
        }
        
        return errors;
    }
    
    function validateEmail(email) {
        const errors = [];
        
        if (!email.trim()) {
            errors.push(errorMessages.email.required);
        } else {
            if (!patterns.email.test(email)) {
                errors.push(errorMessages.email.invalid);
            }
        }
        
        return errors;
    }
    
    function validateMessage(message) {
        const errors = [];
        
        if (!message.trim()) {
            errors.push(errorMessages.message.required);
        } else {
            if (message.length < 10) {
                errors.push(errorMessages.message.minLength);
            } else if (message.length > 500) {
                errors.push(errorMessages.message.maxLength);
            }
        }
        
        return errors;
    }
    

    function showError(inputElement, errorElement, errors) {
        if (errors.length > 0) {
            errorElement.textContent = errors[0]; 
            inputElement.classList.add('error');
            inputElement.classList.add('shake');
            
            
            setTimeout(() => {
                inputElement.classList.remove('shake');
            }, 500);
        } else {
            errorElement.textContent = '';
            inputElement.classList.remove('error');
        }
    }
    
    
    function clearError(inputElement, errorElement) {
        inputElement.classList.remove('error');
        errorElement.textContent = '';
    }
    
    
    nameInput.addEventListener('input', function() {
        const errors = validateName(this.value);
        const errorElement = document.getElementById('nameError');
        showError(this, errorElement, errors);
    });
    
    emailInput.addEventListener('input', function() {
        const errors = validateEmail(this.value);
        const errorElement = document.getElementById('emailError');
        showError(this, errorElement, errors);
    });
    
    messageInput.addEventListener('input', function() {
        const errors = validateMessage(this.value);
        const errorElement = document.getElementById('messageError');
        showError(this, errorElement, errors);
    });
    

    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('focus', function() {
            const fieldName = this.name;
            const errorElement = document.getElementById(fieldName + 'Error');
            clearError(this, errorElement);
        });
    });
    
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
    
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
    
        const nameErrors = validateName(name);
        const emailErrors = validateEmail(email);
        const messageErrors = validateMessage(message);
        
    
        showError(nameInput, document.getElementById('nameError'), nameErrors);
        showError(emailInput, document.getElementById('emailError'), emailErrors);
        showError(messageInput, document.getElementById('messageError'), messageErrors);
        
        
        const isFormValid = nameErrors.length === 0 && emailErrors.length === 0 && messageErrors.length === 0;
        
        if (isFormValid) {
            
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            
            setTimeout(() => {
                
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successMessage.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    
                    [nameInput, emailInput, messageInput].forEach(input => {
                        input.classList.remove('error');
                    });
                    document.querySelectorAll('.error-message').forEach(error => {
                        error.textContent = '';
                    });
                }, 5000);
            }, 1500);
        } else {
            
            if (nameErrors.length > 0) {
                nameInput.focus();
            } else if (emailErrors.length > 0) {
                emailInput.focus();
            } else if (messageErrors.length > 0) {
                messageInput.focus();
            }
        }
    });
    
    
    function updateCharacterCount() {
        const messageLength = messageInput.value.length;
        const maxLength = 500;
        const remaining = maxLength - messageLength;
        
        
        let counter = document.getElementById('charCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'charCounter';
            counter.style.cssText = 'text-align: right; font-size: 0.9rem; color: #7f8c8d; margin-top: 5px;';
            messageInput.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${messageLength}/${maxLength} characters`;
        
        if (remaining < 50) {
            counter.style.color = remaining < 10 ? '#e74c3c' : '#f39c12';
        } else {
            counter.style.color = '#7f8c8d';
        }
    }
    
    
    messageInput.addEventListener('input', updateCharacterCount);
    updateCharacterCount(); 
    
    
    emailInput.addEventListener('blur', function() {
        if (this.value.trim()) {
            const errors = validateEmail(this.value);
            const errorElement = document.getElementById('emailError');
            showError(this, errorElement, errors);
        }
    });
    
    
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            form.dispatchEvent(new Event('submit'));
        }
    });
});

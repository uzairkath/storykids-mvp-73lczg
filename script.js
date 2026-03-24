document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('multiStepForm');
    if (!form) return;

    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = document.querySelectorAll('.next-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const progressBar = document.getElementById('progressBar');
    const photoInput = document.getElementById('photoUpload');
    const uploadZone = document.getElementById('uploadZone');
    const imagePreview = document.getElementById('imagePreview');
    const uploadContent = document.querySelector('.upload-content');

    let currentStep = 1;

    const updateStep = () => {
        steps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });
        progressBar.style.width = `${(currentStep / steps.length) * 100}%`;
    };

    // Validation
    const validateStep = (stepNumber) => {
        if (stepNumber === 1) {
            const name = document.getElementById('childName').value;
            return name.trim().length > 0;
        }
        if (stepNumber === 3) {
            const email = document.getElementById('parentEmail').value;
            const consent = document.getElementById('consent').checked;
            const emailValid = /\S+@\S+\.\S+/.test(email);
            return emailValid && consent;
        }
        return true; // Step 2 (photo) is optional
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateStep();
            } else {
                alert('Please fill in the required fields correctly.');
            }
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateStep();
        });
    });

    // Image Upload Logic
    uploadZone.addEventListener('click', () => photoInput.click());

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size too large (max 5MB)');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.classList.remove('hidden');
                uploadContent.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(3)) {
            // Save basic data to session for demo purposes
            sessionStorage.setItem('storyData', JSON.stringify({
                name: document.getElementById('childName').value,
                email: document.getElementById('parentEmail').value
            }));
            window.location.href = 'checkout.html';
        }
    });
});
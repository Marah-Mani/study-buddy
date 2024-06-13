export const validationRules = {
    email: {
        maxLength: 50,
        minLength: 8,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        maxLength: 10,
        minLength: 8,
        strongRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@!*#%&()^~{}])[A-Za-z\d@!*#%&()^~{}]{8,10}$/
    },
    textLength: {
        maxLength: 500,
        minLength: 10,
    },
    textLongLength: {
        maxLength: 150,
        minLength: 10,
    },
    textEditor: {
        maxLength: 10000,
        minLength: 10,
    },
    phoneNumber: {
        maxLength: 15,
        pattern: /^\+?[0-9]{1,4}?[-. ]?\(?(?:[0-9]{1,3})\)?[-. ]?[0-9]{1,4}[-. ]?[0-9]{1,4}$/
    },
    websiteURL: {
        pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    },
    facebookURL: {
        pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/([a-zA-Z0-9._]{1,30})\/?$/i
    },
    twitterURL: {
        pattern: /^(https?:\/\/)?(www\.)?twitter\.com\/([a-zA-Z0-9_]){1,15}$/i
    },
    linkedinURL: {
        pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+$/i
    },
    instagramURL: {
        pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/([a-zA-Z0-9._]{1,30})\/?$/i
    },
    youtubeURL: {
        pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(\?.*)?$/
    },
    stripeKeys: {
        maxLength: 50,
        pattern: /^(sk_test|pk_test|sk_live|pk_live)_[a-zA-Z0-9]{24}$/ // Adjust the pattern as needed
    },
    paypalKeys: {
        maxLength: 50,
        pattern: /^[A-Z0-9]{16}$/ // Adjust the pattern as needed
    },


    // Add more validation rules as needed
};

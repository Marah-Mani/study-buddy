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
    textLongLength: {
        maxLength: 500,
        minLength: 10,
    },
    textLength: {
        maxLength: 150,
        minLength: 10,
    },
    textEditor: {
        maxLength: 10000,
        minLength: 10,
    },
    chatInput: {
        maxLength: 2000,
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
        pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/.*$/i,
    },
    twitterURL: {
        pattern: /^(https?:\/\/)?(www\.)?twitter\.com(\/\w*)?$/i
    },
    linkedinURL: {
        pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/(.*)$/i
    },
    instagramURL: {
        pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/(.*)$/i
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

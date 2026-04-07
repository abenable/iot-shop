// Test customer sign-up with email verification
const API_URL = 'http://localhost:3000/shop-api';
const CHANNEL_TOKEN = '__default_channel__';

async function testSignUp() {
    const email = `test${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    const mutation = `
        mutation RegisterCustomer($input: RegisterCustomerInput!) {
            registerCustomerAccount(input: $input) {
                ... on Success {
                    success
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
                ... on MissingPasswordError {
                    errorCode
                    message
                }
                ... on PasswordValidationError {
                    errorCode
                    message
                    validationErrorMessage
                }
            }
        }
    `;

    try {
        console.log('Testing customer sign-up...');
        console.log('Email:', email);
        console.log('');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'vendure-token': CHANNEL_TOKEN,
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    input: {
                        emailAddress: email,
                        password: password,
                        firstName: 'Test',
                        lastName: 'User',
                    }
                }
            }),
        });

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));

        if (result.errors) {
            console.error('❌ GraphQL Error:', result.errors[0].message);
            return;
        }

        const responseData = result.data?.registerCustomerAccount;

        if (responseData?.success) {
            console.log('✅ Account created successfully!');
            console.log('');
            console.log('If email verification is enabled,');
            console.log('check the dev mailbox at: http://localhost:3000/mailbox');
        } else {
            console.log('⚠️ Response:', responseData);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testSignUp();

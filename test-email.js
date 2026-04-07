// Test email functionality locally
const API_URL = 'http://localhost:3000/shop-api';
const CHANNEL_TOKEN = '__default_channel__';

// Test 1: Request password reset
async function testPasswordReset() {
    const email = 'test@example.com'; // Use your test email

    const query = `
        mutation RequestPasswordReset($email: String!) {
            requestPasswordReset(emailAddress: $email) {
                ... on Success {
                    success
                }
                ... on NativeAuthStrategyError {
                    errorCode
                    message
                }
            }
        }
    `;

    try {
        console.log('Testing password reset email...');
        console.log('Email:', email);
        console.log('');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'vendure-token': CHANNEL_TOKEN,
            },
            body: JSON.stringify({
                query,
                variables: { email }
            }),
        });

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));

        if (result.errors) {
            console.error('❌ GraphQL Error:', result.errors[0].message);
            return;
        }

        if (result.data?.requestPasswordReset?.success) {
            console.log('✅ Password reset request sent!');
            console.log('');
            console.log('Check the dev mailbox at: http://localhost:3000/mailbox');
            console.log('Or check Mailtrap inbox if SMTP is configured');
        } else {
            console.log('⚠️ Response:', result.data?.requestPasswordReset);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Test 2: Check email configuration
async function checkEmailConfig() {
    console.log('=== Email Configuration ===');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'not set (using dev mode)');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 'not set');
    console.log('FROM_EMAIL:', process.env.FROM_EMAIL || 'not set');
    console.log('');
}

async function main() {
    await checkEmailConfig();
    await testPasswordReset();
}

main();

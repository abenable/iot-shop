// Test email to ableabenaitwe@gmail.com
const API_URL = 'http://localhost:3000/shop-api';
const CHANNEL_TOKEN = '__default_channel__';

async function testPasswordReset() {
    const email = 'ableabenaitwe@gmail.com';

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
        console.log('Sending test email to:', email);
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

        if (result.errors) {
            console.error('❌ Error:', result.errors[0].message);
            return;
        }

        if (result.data?.requestPasswordReset?.success) {
            console.log('✅ Email sent successfully!');
            console.log('');
            console.log('Check your inbox at ableabenaitwe@gmail.com');
            console.log('Also check Mailtrap dashboard for the captured email');
        } else {
            console.log('⚠️ Response:', result.data?.requestPasswordReset);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testPasswordReset();

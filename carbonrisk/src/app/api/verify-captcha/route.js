import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Get the request path
        const path = request.nextUrl.pathname;

        // Define paths where captcha should be verified
        const pathsRequiringCaptcha = ['/login', '/signup']; // Update these paths as needed

        // Only process captcha verification if the request is for login or signup
        if (pathsRequiringCaptcha.includes(path)) {
            const { token } = await request.json();

            // Return error if token is missing
            if (!token) {
                return NextResponse.json(
                    { success: false, error: 'Missing token' },
                    { status: 400 }
                );
            }

            // Proceed with captcha verification
            const verificationUrl = 'https://hcaptcha.com/siteverify';
            const verifyBody = new URLSearchParams({
                response: token,
                secret: process.env.HCAPTCHA_SECRET_KEY,
                sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
            }).toString();

            const response = await fetch(verificationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: verifyBody,
            });

            const data = await response.json();

            if (!data.success) {
                console.error('Captcha verification failed:', data['error-codes']);
                return NextResponse.json({
                    success: false,
                    errors: data['error-codes']
                }, { status: 400 });
            }

            return NextResponse.json({ success: true });
        }

        // Skip captcha verification for all other paths
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

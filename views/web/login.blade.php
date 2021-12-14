<ce-form>
    <div style="margin: auto; max-width: 400px;">
        <div style="text-align: center; margin-bottom: 2em;">
            <ce-text style="--font-size: var(--ce-font-size-xx-large); --font-weight: var(--ce-font-weight-bold)">
                Sign in to your account
            </ce-text>
        </div>
        <ce-card>
            <ce-input label="Username or Email Address"></ce-input>
            <ce-input label="Password" type="password"></ce-input>
            <ce-button type="primary" submit full>
                <svg xmlns="http://www.w3.org/2000/svg" slot="prefix" width="16" height="16" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Log In
            </ce-button>
            <ce-divider>or</ce-divider>
            <ce-button submit full>
                Email me a magic link
            </ce-button>
        </ce-card>
    </div>
</ce-form>

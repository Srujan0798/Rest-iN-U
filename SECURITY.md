Security Policy
Supported Versions
We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:
Version
Supported
1.x.x
:white_check_mark:
< 1.0
:x:

Reporting a Vulnerability
We take security vulnerabilities seriously and appreciate your efforts to responsibly disclose your findings.
How to Report
Please do not report security vulnerabilities through public GitHub issues.
Instead, please report them via email to security@dharmarealty.com.
You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.
What to Include
Please include the following information in your report:
Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
Full paths of source file(s) related to the manifestation of the issue
The location of the affected source code (tag/branch/commit or direct URL)
Any special configuration required to reproduce the issue
Step-by-step instructions to reproduce the issue
Proof-of-concept or exploit code (if possible)
Impact of the issue, including how an attacker might exploit the issue
What to Expect
After you submit a vulnerability report:
Acknowledgment: We will acknowledge receipt within 48 hours
Assessment: We will assess the vulnerability and determine its severity
Communication: We will keep you informed of our progress
Fix: We will work on a fix and coordinate with you on disclosure timing
Credit: We will credit you for the discovery (unless you prefer to remain anonymous)
Bug Bounty Program
While we don't currently have a formal bug bounty program, we do offer rewards for significant security findings at our discretion. Rewards are based on:
Severity of the vulnerability
Quality of the report
Responsible disclosure
Safe Harbor
We consider security research conducted in accordance with this policy to be:
Authorized in accordance with the Computer Fraud and Abuse Act (CFAA)
Exempt from the DMCA
Lawful, helpful, and done in good faith
We will not pursue civil action or initiate a complaint with law enforcement for accidental, good-faith violations of this policy.
Security Best Practices
For Users
Use strong, unique passwords
Enable two-factor authentication when available
Keep your browser and devices updated
Be cautious of phishing attempts
For Developers
Never commit secrets or credentials to the repository
Use environment variables for sensitive configuration
Keep dependencies updated
Follow secure coding practices
Implement proper input validation
Use parameterized queries to prevent SQL injection
Known Security Features
Dharma Realty implements the following security measures:
Authentication: JWT-based authentication with secure token handling
Authorization: Role-based access control (RBAC)
Data Encryption: TLS/SSL for data in transit, AES-256 for sensitive data at rest
Input Validation: Server-side validation using Zod schemas
XSS Prevention: Content Security Policy (CSP) headers
CSRF Protection: Anti-CSRF tokens for state-changing operations
Rate Limiting: API rate limiting to prevent abuse
Audit Logging: Comprehensive logging of security-relevant events
Security Contact
Email: security@dharmarealty.com
PGP Key: Available upon request
Thank you for helping keep Dharma Realty and our users safe!
LICIENCE
MIT License

Copyright (c) 2024 Dharma Realty

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


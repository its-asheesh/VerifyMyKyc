import dotenv from 'dotenv';
import { connectDB } from '../../config/db';
import { BlogPost } from './blog.model';

// Load env
dotenv.config();

const posts = [
  {
    title: 'How to Use Government ID Verification',
    slug: 'government-id-verification-guide',
    excerpt:
      'Learn how to verify PAN, Aadhaar, Voter ID, Driving Licence, and Passport securely and quickly using VerifyMyKyc.',
    content: `Overview
Government ID verification helps you validate a user’s identity by checking official documents (PAN, Aadhaar, Voter ID, Driving Licence, Passport) against trusted sources.

When to use it
- Onboard new users
- Prevent impersonation / fraud
- Meet KYC/AML compliance

How it works (typical flow)
1) Capture the document details (number and/or image) in the client app.
2) Optionally run OCR to prefill fields.
3) Submit data to the corresponding verification API (Aadhaar, PAN, Voter, DL, Passport).
4) Get the result: match status, basic profile, and confidence.

Best practices
- Use masked logs; never store raw IDs without consent.
- For image uploads, ensure HTTPS and short-lived storage.
- Combine with liveness detection when higher assurance is required.

Next steps
- Try a sandbox call using test numbers.
- Integrate our endpoint in your onboarding form.
`,
    coverImage: '/cat1.png',
    tags: ['how-to', 'kyc', 'government-id'],
    status: 'published' as const,
    author: 'VerifyMyKyc Team',
  },
  {
    title: 'How to Use Company & Credential Verification',
    slug: 'company-credential-verification-guide',
    excerpt:
      'Verify GST, FSSAI, MSME, and company registration to ensure legitimate partnerships and vendor trust.',
    content: `Overview
Company & credential verification validates business identity and licenses, reducing vendor risk.

When to use it
- Vendor onboarding, supplier due diligence
- Marketplace seller verification

How it works
1) Collect identifiers (GSTIN, FSSAI, MSME, CIN, DIN).
2) Call the relevant verification endpoint.
3) Receive entity details, status, and validation result.

Best practices
- Cache immutable data (e.g., registration name) for faster UX.
- Re-verify periodically for licenses with expiry.

Next steps
- Start with GSTIN verification, then add MCA checks.
`,
    coverImage: '/cat2.jpg',
    tags: ['how-to', 'kyb', 'gstin', 'mca'],
    status: 'published' as const,
    author: 'VerifyMyKyc Team',
  },
  {
    title: 'How to Run Legal & Background Checks',
    slug: 'legal-background-checks-guide',
    excerpt:
      'Screen for criminal records, court cases, and FIRs to maintain platform integrity and safety.',
    content: `Overview
Background checks help you assess legal risk by screening across official records.

When to use it
- Workforce screening
- High-risk roles and enterprise onboarding

How it works
1) Provide identity details (name, DoB, optional IDs).
2) Initiate a background check.
3) Review match results and evidence summary.

Best practices
- Obtain consent and disclose purpose.
- Have a review process for potential false positives.

Next steps
- Pilot checks for a subset of users, then automate.
`,
    coverImage: '/cat3.png',
    tags: ['how-to', 'background-checks', 'compliance'],
    status: 'published' as const,
    author: 'VerifyMyKyc Team',
  },
  {
    title: 'How to Use Biometric & Liveness Checks',
    slug: 'biometric-liveness-checks-guide',
    excerpt: 'Add face match and active/passive liveness to stop spoofing and raise assurance.',
    content: `Overview
Biometric checks compare a selfie with a document photo and verify the person is live (not a photo or video).

How it works
1) Capture a selfie with motion prompts (blink, turn head).
2) Run liveness detection and face match.
3) Combine with ID verification for highest assurance.

Best practices
- Guide users with clear on-screen prompts.
- Enforce lighting and camera checks before capture.

Next steps
- Enable liveness for sensitive actions (payouts, role upgrades).
`,
    coverImage: '/cat4.png',
    tags: ['how-to', 'biometric', 'liveness'],
    status: 'published' as const,
    author: 'VerifyMyKyc Team',
  },
  {
    title: 'How to Use Specialized Checks',
    slug: 'specialized-verifications-guide',
    excerpt:
      'Verify domain-specific credentials like health and travel certificates quickly and reliably.',
    content: `Overview
Specialized checks cover niche credentials (e.g., health, travel).

How it works
1) Collect the certificate ID or image.
2) Call the corresponding verification endpoint.
3) Show result with key fields and validity.

Best practices
- Handle expired/invalid certificates gracefully.
- Add fallback help links for manual review.

Next steps
- Extend with your industry’s niche credentials over time.
`,
    coverImage: '/cat5.png',
    tags: ['how-to', 'specialized', 'verification'],
    status: 'published' as const,
    author: 'VerifyMyKyc Team',
  },
];

async function upsertPosts() {
  for (const p of posts) {
    const existing = await BlogPost.findOne({ slug: p.slug });
    if (existing) {
      existing.title = p.title;
      existing.excerpt = p.excerpt;
      existing.content = p.content;
      existing.coverImage = p.coverImage;
      existing.tags = p.tags as any;
      existing.status = p.status as any;
      existing.author = p.author;
      await existing.save();
      console.log(`🔁 Updated: ${p.slug}`);
    } else {
      await BlogPost.create(p as any);
      console.log(`✅ Created: ${p.slug}`);
    }
  }
}

(async () => {
  try {
    await connectDB();
    await upsertPosts();
    console.log('🎉 Blog posts seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed blog posts', err);
    process.exit(1);
  }
})();

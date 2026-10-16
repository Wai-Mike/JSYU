# JSYU App Portal — User-Facing Content Inventory

Source: public site on `config('app.domain')` (`routes/web.php`).
Extracted from association pages, blog, auth, nav/footer, and legacy DigiFriend guest landing.

---

## Notes on dynamic / PHP-driven content

| Source | What it passes |
|--------|----------------|
| `AssociationPageController` | Only `user` — **no content props** |
| `BlogController` | `posts` (paginated), `filters`, single `post` + comments — titles, excerpts, body, images, author names, dates from DB |
| `UserPostController` | `types` from `Post::types()`; flash: *"Your post has been submitted and is pending approval."* |
| `CommentController` | Flash: *"Comment added."* |
| `RegisterController` | Flash: *"Registration successful! Welcome to our platform."* |
| Auth status messages | Laravel password-reset / verification status strings (server-driven) |

Home news preview and testimonials on the association home page are **hardcoded sample content**, not from the blog API.

---

## 1. Home (`/` — `association/main`)

### Hero
- **Eyebrow:** Jonglei State Youth Union
- **H1:** Empowering Youth / Takes Many Forms
- **Body:** A unified platform for young people across Jonglei to organise, advocate, and build peaceful communities.
- **CTA:** View Programs
- **Alt:** (hero image via `sectionImages.hero`)

### Impact / membership bar
- Membership is open across all **{9}** counties — **join the youth of Jonglei**
- **CTA:** Join Now

### About
- **Eyebrow:** Consulting
- **H2:** How we can help you?
- **Body:** The Jonglei State Youth Union is an independent, non-political civil society organisation — the primary representative body for young people across all 9 counties of Jonglei State, South Sudan. Under SSNYU and the National Youth Development Policy, we institutionalise youth representation, facilitate peacebuilding, and advocate for education, skills, and economic opportunity — including youth with disabilities in our leadership.
- **CTA:** Learn More
- **Strip:** More from Jonglei State Youth Union — representation · peace · opportunity
- **Img alt:** JSYU leadership and youth representatives

### Programs preview
- **H2:** our programs
- **Intro:** Key areas advancing youth representation, peace, education, and opportunity across Jonglei State.
- **CTA:** View All Programs

| Name | Description |
|------|-------------|
| Youth Representation & Advocacy | Promoting institutionalized representation of youth in state and county-level decision-making. |
| Peacebuilding & Social Cohesion | Facilitating dialogues between ethnic communities to mitigate inter-communal violence. |
| Education & Vocational Training | Advocating for quality education and vocational training as alternatives to armed mobilization. |
| Humanitarian Advocacy | Advocating for humanitarian access and support for displaced youth across Jonglei. |
| Youth Economic Empowerment | Supporting entrepreneurship, vocational skills, and livelihood opportunities in all 9 counties. |
| Climate & Environmental Protection | Building climate resilience and promoting environmental stewardship among young people. |

### Opportunities
- **H2:** opportunities served
- **Intro:** Ways for young people to participate, learn, lead, and contribute across Jonglei State.

| Tag | Title | Description | CTA |
|-----|-------|-------------|-----|
| From Education | Scholarships & Learning | Explore education pathways and advocacy for quality learning across Jonglei State. | Read More |
| From Training | Vocational Skills | Professional development and vocational opportunities for youth skills building. | Read More |
| *(featured)* | Get Involved | Volunteer, lead, and join forums shaping peace and opportunity in every county. | View Opportunities |
| From Community | Youth Events & Forums | Participate in dialogues, forums, and community activities organised by JSYU. | Read More |
| From Enterprise | Livelihoods & Startups | Connect with programs supporting entrepreneurship and income generation. | Read More |
| From Governance | Leadership Pathways | Build civic skills and engage in youth representation at county and state levels. | Read More |

**Featured jobs list:**
- Bor County — Youth Forum Volunteer
- Ayod · Fangak — Peace Caravan Lead

### Testimonials
| Name | Role | Quote |
|------|------|-------|
| Nyandeng Mabior | Youth member · Bor County | Through JSYU dialogues in Bor, I learned how young people from Nuer, Dinka, and Anyuak communities can sit together and push for peace in our payams. |
| Gatwech Deng | Peace caravan participant · Ayod County | The inter-county peace football tournament brought youth from Fangak and Ayod into one pitch. We left with friendships and a shared promise to reject revenge violence. |
| Achol Omot | Volunteer · Pochalla County | I joined a JSYU clean-up and tree-planting day near Pochalla. Serving our neighbours taught me that climate action and community care start with youth hands. |

- **Aria labels:** Show testimonial from {name}

### Image ribbon
- Labels: Community · Peace · Education · Leadership
- Subtext (each): View portfolio

### Latest news & events (hardcoded preview)
- **H2:** latest news & events
- **Intro:** Subscribe to our updates and get the latest news from youth programs across Jonglei.
- **CTA (each):** Read More

| Date | Category | Title | Description | Img alt |
|------|----------|-------|-------------|---------|
| 12 March 2026 | Community | County youth forum opens in Bor with all nine counties represented | JSYU convened Nuer, Dinka, and Anyuak youth leaders in Bor to set shared priorities on livelihoods, peace, and flood preparedness for the 2026/2030 term. | South Sudanese youth gathering outdoors in Jonglei |
| 28 February 2026 | Peace | Peace caravan links Ayod and Fangak youth ahead of rainy season | Football matches and mediation training brought young people together to reduce revenge attacks and strengthen social cohesion along the White Nile corridor. | South Sudanese youth in a community peace dialogue under a tree |
| 5 February 2026 | Education | Vocational skills week launches for youth in Pochalla and Twic East | Carpentry, tailoring, and ICT sessions opened under the Economic Empowerment program, with places reserved for young women and youth with disabilities. | South Sudanese youth learning together in an outdoor classroom |

### Leadership (Chairman)
- **H2:** our leadership
- **Eyebrow:** Chairman · Term 2026/2030
- **H3:** Tot Bangot Deng
- **Body:** At the heart of the Jonglei State Youth Union is leadership committed to representation, peacebuilding, and opportunity for every young person across Jonglei — working with community leaders, youth groups, and partners to turn the voice of youth into real change.
- **Focus areas:**
  - Youth representation in state decisions
  - Community peace & reconciliation
  - Education and livelihoods for youth
- **A message to youth:** “When youth are included, communities are safer, fairer, and more hopeful. Jonglei's future is in your hands.”
- **Img alt:** Jonglei State Youth Union Chairman Tot Bangot Deng

### CTA / Contact
- **H2:** Your Voice. Your Future. Your Community.
- **Body:** Whether you are a student, community leader, partner organisation, or international actor — there is a place for you in the Jonglei State Youth Union.
- **CTAs:** Join JSYU · Contact the Team · Discover Programs
- **Email:** info@luac-akook-yieu.org

---

## 2. Programs (`/programs`)

### Page header
- **Eyebrow:** Our Strategic Programs
- **H1:** Fiscal Year 2026/2030 programs for Jonglei youth
- **Intro:** These program areas come from the Jonglei State Youth Union Fiscal Year Plan and Annual Work Plan 2026/2030. They respond to unemployment, conflict, climate shocks, health risks, and leadership gaps affecting young people across all 9 counties—with a deliberate focus on youth with disabilities.

### Labels (each card)
- Objective · Key activities · Expected results

### Program 1 — Youth Economic Empowerment & Livelihoods
- **Objective:** Reduce unemployment and promote entrepreneurship and self-reliance among youth across all 9 counties.
- **Activities:**
  - Vocational skills training (carpentry, welding, tailoring, mechanics)
  - Entrepreneurship and small business management workshops
  - Youth savings and loan groups (VSLA model)
  - Support to agricultural initiatives (seed distribution and modern farming training)
  - Youth Fishing & Livelihoods in the SUDD swamps: workshops on better fishing behaviours, ethics, and good practices
- **Outcomes:** More youth in dignified income-generating activities · Reduced idleness and dependency · Stronger local economies in counties and payams
- **Highlight:** Includes targeted livelihood support and training for youth with disabilities.

### Program 2 — Peacebuilding & Social Cohesion
- **Objective:** Strengthen unity and prevent youth involvement in violence and revenge attacks.
- **Activities:** Inter-county youth dialogue forums and peace caravans · Peace football tournaments and cultural events for unity · Training on mediation, non-violent communication, and conflict resolution · Anti-cattle raiding and anti-revenge violence campaigns
- **Outcomes:** Youth recognized as peace ambassadors in their communities · Reduced participation of youth in cycles of violence · Improved inter-communal relationships across Jonglei

### Program 3 — Education, Leadership & Capacity Building
- **Objective:** Improve youth leadership, participation in governance, and employability.
- **Activities:** Leadership, governance, and public speaking training · Advocacy and civic engagement workshops · ICT and computer literacy training · Mentorship programs linking youth with professionals · Scholarship mobilisation and support where possible
- **Outcomes:** Stronger youth leadership at state and county levels · More skilled and employable young people · Better representation of youth in governance spaces

### Program 4 — Climate Change & Environmental Protection
- **Objective:** Build climate resilience and promote environmental stewardship among young people.
- **Activities:** Tree planting and re-greening campaigns · Community clean-up days in towns and IDP sites · Flood awareness and disaster risk education · Training on climate-smart agriculture and responsible natural resource use
- **Outcomes:** Cleaner and safer environments for communities · Greater youth participation in climate action · Improved preparedness for floods and climate shocks

### Program 5 — Health & Social Awareness
- **Objective:** Promote healthy lifestyles and responsible behaviour among youth.
- **Activities:** HIV/AIDS and sexual & reproductive health awareness campaigns · Anti-drug and alcohol abuse campaigns · Mental health and psychosocial awareness sessions · Community conversations on positive social norms
- **Outcomes:** Healthier and more informed youth population · Reduced risky behaviours and substance abuse · Greater openness to discuss mental health and wellbeing

### Program 6 — Sports, Talent & Cultural Development
- **Objective:** Engage youth positively and nurture their talents for peace and development.
- **Activities:** State-wide football and athletics competitions · Cultural dance, music, and poetry festivals · Talent shows and talent identification events · Inclusive sporting activities that involve youth with disabilities
- **Outcomes:** Reduced idleness and crime among youth · Social cohesion across communities and counties · Discovery and promotion of promising young talents

### Program 7 — Volunteerism & Community Service
- **Objective:** Promote civic responsibility and community service by youth.
- **Activities:** Formation and support of youth volunteer groups · School and health facility renovation and clean-up · Community road repair and basic infrastructure support · Support to elderly people, vulnerable families, and persons with disabilities
- **Outcomes:** Stronger community trust in youth structures · Visible youth-led solutions in communities · Positive image of youth as partners in development

### Program 8 — Inclusion & Youth with Disabilities
- **Objective:** Ensure that youth with disabilities are fully represented, participate, and benefit from all JSYU programs.
- **Activities:** Strengthening representation of youth with disabilities in JSYU leadership (including the Speaker position) · Ensuring accessibility and reasonable accommodation in trainings, events, and information sharing · Awareness sessions on disability rights and inclusion for community leaders and youth groups · Working with partners to tailor economic and skills programmes for youth with disabilities
- **Outcomes:** Youth with disabilities visibly participating and leading within the Union · All 9 counties recognising youth with disabilities in youth structures · Disability inclusion mainstreamed across every JSYU program area
- **Highlight:** This program cuts across every other area and ensures no young person is left behind.

### Cross-cutting priorities
- **H2:** Cross-cutting priorities
- **Body:** Every program in this plan is designed to intentionally include **young women**, **youth with disabilities**, and **youth from all 9 counties of Jonglei**. Transparency, accountability, and youth participation in decision-making are non-negotiable principles in how we plan, implement, and report on our work.

---

## 3. Work Plan (`/work-plan`)

### Page header
- **Eyebrow:** Annual Work Plan 2026/2030
- **H1:** Jonglei State Youth Union Work Plan
- **Intro:** This Annual Work Plan sets out how the Jonglei State Youth Union will mobilise, empower, and represent youth across all 9 counties in the 2026/2030 fiscal year—with a clear focus on economic empowerment, peacebuilding, climate resilience, health, and inclusion of youth with disabilities.

### Vision
- A united, skilled, peaceful, and economically empowered youth population contributing to sustainable development in Jonglei State.

### Mission
- To mobilise, empower, and represent youth through capacity building, peacebuilding initiatives, economic programmes, and community development activities, with deliberate inclusion of youth with disabilities.

### Strategic Objectives
1. Enhance youth economic empowerment and self-reliance.
2. Promote peace, unity, and conflict resolution among communities.
3. Strengthen youth leadership, governance participation, and skills development.
4. Increase youth engagement in climate resilience and environmental protection.
5. Promote healthy lifestyles and social responsibility.
6. Encourage volunteerism, civic engagement, and community service.

### Program Areas
- **Intro:** The work plan is implemented through 7 core program areas and a cross-cutting inclusion program for youth with disabilities:
1. Youth Economic Empowerment & Livelihoods (including fishing livelihoods in the SUDD swamps)
2. Peacebuilding & Social Cohesion
3. Education, Leadership & Capacity Building
4. Climate Change & Environmental Protection
5. Health & Social Awareness
6. Sports, Talent & Cultural Development
7. Volunteerism & Community Service
8. Inclusion & Youth with Disabilities (cross-cutting)
- **Link text:** You can explore the details of each program area on the **Programs page**.

### Implementation & Monitoring
- Implementation will be led by the JSYU Secretariat in partnership with county youth unions, State Government ministries, NGOs, and development partners. Youth structures in all 9 counties will help adapt activities to local realities.
- Progress will be tracked through quarterly review meetings, activity and financial reports, and an annual performance review, ensuring that youth themselves can hold their leaders accountable.

### Cross-cutting priorities
- Gender equality and meaningful participation of young women.
- Full inclusion and representation of youth with disabilities in leadership and programs (including the Speaker).
- Transparency, accountability, and responsible use of resources.
- Youth participation in planning, implementation, and decision-making at all levels.
- Coverage of all 9 counties of Jonglei through county-level youth coordination.

### Conclusion
- The Annual Work Plan 2026/2030 is a roadmap for youth empowerment, peace, and development in Jonglei State. Its success depends on strong coordination, transparent leadership, and active participation from youth, communities, partners, and government. Together, we can ensure that no young person—including youth with disabilities—is left behind.

---

## 4. Blog

### Index (`/blog`)
- **Document title:** Blog - Jonglei State Youth Union
- **Eyebrow:** Youth stories & updates
- **H1:** latest news & events
- **Intro:** Share experiences, highlight programs, and stay connected with youth across Jonglei State.

**Composer (logged-in):**
- What's on your mind, {first name | friend}?
- Photo · Video · Feeling
- Posts are reviewed by admins before appearing in the feed.

**Filters:** All types · Article · Program · Announcement · Resource · Clear

**Empty state:** No posts yet. Be the first to share something.

**Post UI chrome:**
- Fallback author: Jonglei Youth Member
- `{n} likes · {n} hearts · {n} comment(s)` / No comments yet
- Like · Heart · Comment
- Placeholder: Write a comment...
- Button: Post
- Pagination: Previous · Page {n} of {m} · Next

**Sidebar:**
- About this space
- This feed is for youth across Jonglei to share stories, programs, and ideas that move the state forward.

**Dynamic:** post title, excerpt, content, featured image, author, dates, reaction/comment counts from API.

### Show (`/blog/{slug}`)
- **Document title:** {post.title} - Jonglei State Youth Union
- Back to blog
- Type labels: Article / Program / Announcement / Resource
- Comments ({n})
- Placeholder: Add a comment...
- Post comment / Posting...
- Log in to comment.
- No comments yet. Be the first to comment.
- **Dynamic:** title, excerpt, HTML content, image, author, comments

### Create (`/blog-create`)
- **Document title:** Write a post - Jonglei State Youth Union
- ← Back to blog
- **H1:** Write a post
- Your post will be reviewed by an admin before it appears on the blog.
- Labels: Title * · Type · Short summary (optional) · Content * · Featured image (optional)
- Placeholders: Post title · Brief summary · Write your post...
- Help: Add a photo for your article/program (max 4MB).
- Submit for approval / Submitting... · Cancel
- **Types from PHP** (`Post::types()`): Article, Program, Announcement, Resource

**Flash (PHP):** Your post has been submitted and is pending approval. · Comment added.

---

## 5. Auth

### Login
- **Document title:** Login - Jonglei State Youth Union
- **H1:** Sign in
- Email address · Password · Forgot password? · Remember me
- Placeholders: you@example.com · Enter your password
- Aria: Hide password / Show password
- Sign in / Signing in... · Or · Continue with Google / Loading...
- No account? Create one
- ← Back to home
- **Alt:** Jonglei State Youth Union

### Register
- **Document title:** Join the Union - Jonglei State Youth Union
- Brand panel: JSYU · Jonglei State Youth Union
- **Eyebrow:** Join the Union
- **H1:** Your voice matters in Jonglei State
- Become part of the Jonglei State Youth Union and help shape peace, opportunity, and leadership for young people across our state.
- **Benefits:**
  - Connect with youth from all 9 counties of Jonglei
  - Access programs, forums, and volunteer opportunities
  - Share updates and join community conversations
  - Stand with Nuer, Dinka, and Anyuak youth for unity and peace
- Open to youth across Jonglei · Term 2026/2030
- **Form H2:** Join the Youth Union
- Create your account and get involved in JSYU programs and activities
- Full name · Email address · Password · Confirm password
- Placeholders: Enter your full name · you@example.com · Create a strong password · Confirm your password
- I agree to participate respectfully in JSYU activities and community guidelines.
- Join the Union / Creating account... · Or continue with · Continue with Google / Loading...
- Already have an account? Sign in · ← Back to home

### Forgot password
- **Document title:** Forgot Password - Jonglei State Youth Union
- **H2:** Forgot your password?
- No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
- Email Address · Enter your email address
- Email Password Reset Link / Sending... · Back to login

### Reset password
- **Document title:** Reset Password - Jonglei State Youth Union
- **H2:** Reset your password
- Enter your new password below.
- Email Address · New Password · Confirm New Password
- Placeholders: Enter your new password · Confirm your new password
- Reset Password / Resetting... · Back to login

### Verify email
- **Document title:** Verify Email - Jonglei State Youth Union
- Left panel: Jonglei State Youth Union · Verify your email to access your account and get involved
- **H1:** Verify Your Email
- Before continuing, please verify your email address by clicking the link in the email we sent you.
- Status: A new verification link has been sent to your email address.
- **Didn't receive the email?** Check your spam folder or click the button below to request a new verification link.
- Resend Verification Email / Sending...
- If you continue to have issues, please contact support.
- ← Back to home

---

## 6. Nav & Footer (`GuestNavbar` + `Footer` via `GuestLayout` / `AssociationLayout`)

### Top utility bar
- **Brand:** JSYU · Jonglei State Youth Union
- Bor, Jonglei State · info@luac-akook-yieu.org · South Sudan
- **Alt:** Jonglei State Youth Union

### Main nav links
Home · About Us · Programs · Opportunities · News · Work Plan · Contact

### Nav actions
- Aria: Search news
- Hi, {name} · Signed in as · Logout · Login
- **CTA:** Join the Union
- Aria: Open menu / Close menu

### Footer — Headquarters
- Interactively coordinate youth representation, peacebuilding, and opportunity across Jonglei State.
- Bor, Jonglei State, South Sudan
- Working hours: Mon – Sat
- info@luac-akook-yieu.org

### Footer — We are everywhere
- County youth coordination across all 9 counties of Jonglei — Nuer, Dinka, and Anyuak communities.
- Bor · Twic East · Duk
- Ayod · Fangak · Canal/Pigi
- Nyirol · Uror · Pochalla

### Footer — Get Social
- Follow our activity and stay connected with youth programs across Jonglei.
- Aria: Facebook · Instagram · LinkedIn

### Footer — About us links
About Us · Programs · Work Plan · Contact · News · Join

### Footer — Popular categories
Representation · Peacebuilding · Education · Livelihoods · Climate · Inclusion

### Footer — Our focus tags
Advocacy · Peace Forums · Skills Training · VSLA Groups · Volunteerism · Sports · Disability Inclusion

### Footer bottom
- © {year} Jonglei State Youth Union. All rights reserved.
- Home · About us · Programs · News

---

## 7. Legacy DigiFriend guest landing (`resources/js/pages/guest/main/**`)

**Status:** Still present in the repo. `PageController` still renders it, but **`routes/web.php` home now uses `AssociationPageController`** — this page is not currently routed on the app domain.

### Hero
- Your **Child's** First Guide to the **Digital World**
- The playful, safe way for kids ages 6–8 to build foundational digital literacy through interactive adventures.
- Start Your Adventure · Explore Demo
- Alts: Digital learning adventure · DigiFriends

### About
- About Our Platform
- We believe every child deserves a strong foundation in digital literacy. Our platform provides a playful, safe, and engaging way for young learners to explore the digital world with confidence and curiosity.

### How It Works
- 📖 Get the Book — The tactile, screen-free adventure with stickers and stories.
- 💻 Play Online — The interactive digital playground that brings characters to life.
- 🧠 Learn & Grow — Watch confidence soar as they master the digital world.

### DigiFriends
- Meet the DigiFriends
- Your child's guides on this learning adventure!
- Kibo — Curious Explorer
- Nuru — Friendly Explainer
- Piki — Helpful Robot Friend

### Learning Journey
| Name | Description |
|------|-------------|
| Magical Tech Tree | Explore the wonders of technology |
| Digital ABCs | Learn the basics of digital literacy |
| Inside Computers | Discover how computers work |
| Digital Superstars | Meet tech heroes and innovators |
| Mini Makers | Create and build amazing projects |

### CTA
- Ready to Begin Your Digital Adventure?
- Start exploring the digital world with fun, interactive activities designed just for you!
- Explore Free Activities · Buy the Book & Get Digital Access*
- *Digital access included with book purchase

### Legacy FooterSection (embedded in guest/main; separate from site Footer)
- Brand: Jonglei State Youth Union
- The primary representative body for young people in Jonglei State, South Sudan. Advocating for youth representation, peacebuilding, education, and economic opportunities.
- info@luac-akook-yieu.org · Bor, Jonglei State, South Sudan
- **Company:** About Us · Our Mission · Programs · Contact
- **Resources:** Youth Representation · Peacebuilding · Education & Training · Get Involved
- **Legal:** Privacy Policy · Terms of Service
- Follow us: · Facebook · Instagram · Twitter
- © {year} Jonglei State Youth Union. All rights reserved.

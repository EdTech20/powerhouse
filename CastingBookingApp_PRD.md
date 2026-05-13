# Product Requirements Document
## Casting Booking Information Collection App
**Version 1.0 | Prepared for Base44 Development**

---

## 1. OVERVIEW

### Purpose
A web application for casting directors to manage post-booking talent information collection. When actors are booked for a commercial or TV production, the app sends automated data-collection requests to their agents, tracks responses in real time, enforces a 24-hour response deadline, and outputs a live, curated booking sheet shared with production.

### The Problem It Solves
Casting directors routinely send booking notifications on Friday evenings. Agents frequently do not respond until Monday, leaving production without critical talent information over the weekend. This app centralizes the request, automates the outreach, enforces a deadline, and populates a live booking sheet — eliminating the manual weekend chase.

---

## 2. USER ROLES

| Role | Description |
|------|-------------|
| **Casting Director** | Primary user. Creates bookings, initiates agent outreach, monitors responses, views booking sheet. |
| **Agent** | External recipient. Receives a unique link, fills out a web form with talent info, submits. No app login required. |
| **Production** | External viewer. Has read-only access to the live booking sheet (via shared Google Sheet or in-app view). |

---

## 3. CORE USER FLOWS

### Flow A — Casting Director Creates a Booking Job

1. Casting Director logs into the app.
2. Creates a new **Booking Job** (e.g., "Nike Commercial — May Shoot").
3. Enters the list of booked actors (name + their agent's email address).
4. Clicks **"Send Booking Requests"**.
5. App sends each agent a unique link to a web form.
6. 24-hour countdown begins per agent from the moment the email is sent.
7. Casting Director monitors the **Dashboard** as responses come in.

### Flow B — Agent Receives and Submits the Form

1. Agent receives an email with a unique, secure link.
2. Clicks the link — opens a clean, mobile-friendly web form (no login required).
3. Fills in all required fields for their actor(s).
4. Submits the form.
5. Confirmation message displayed on screen. Data immediately appears in the booking sheet.

### Flow C — Booking Sheet Auto-Populates

1. As each agent submits, their actor's row on the booking sheet populates in real time.
2. Incomplete or missing submissions show clearly (empty cells or "Awaiting" status).
3. Overdue agents (past 24 hours, no submission) are flagged in red on the booking sheet.
4. Production views the sheet live — no manual export required.

---

## 4. DATA MODEL

### 4.1 Booking Job
| Field | Type | Notes |
|-------|------|-------|
| Job ID | Auto-generated | Unique identifier |
| Job Name | Text | e.g., "Nike Commercial — May Shoot" |
| Production Company | Text | Optional |
| Shoot Date | Date | |
| Created By | User ref | Casting Director |
| Created At | Timestamp | |
| Status | Enum | Active / Closed / Archived |

### 4.2 Actor Booking Record
| Field | Type | Notes |
|-------|------|-------|
| Booking ID | Auto-generated | |
| Job ID | Foreign key | Links to Booking Job |
| Actor Name | Text | Entered by Casting Director |
| Agent Name | Text | Entered by Casting Director |
| Agent Email | Email | Used to send the form link |
| Form Link | Auto-generated URL | Unique per actor |
| Request Sent At | Timestamp | When email was dispatched |
| Deadline | Timestamp | Request Sent At + 24 hours |
| Submission Status | Enum | Pending / Submitted / Overdue |
| Submitted At | Timestamp | When agent submitted form |

### 4.3 Agent Form Submission (fields collected per actor)
| Field | Type | Required |
|-------|------|----------|
| Actor Legal Name | Text | Yes |
| Actor Email Address | Email | Yes |
| Actor Phone Number | Phone | Yes |
| Actor Mailing Address (Street, City, Province/State, Postal Code) | Text / structured | Yes |
| Confirmation of Booking | Yes / No toggle | Yes |
| Social Media Handles (Instagram, TikTok, Twitter/X — each separate field) | Text | Yes |
| Shirt/Top Size | Dropdown (XS, S, M, L, XL, XXL) | Yes |
| Pants/Bottom Size (waist + inseam or standard size) | Text | Yes |
| Shoe Size | Text | Yes |
| Dress Size (if applicable) | Text | Optional |
| Any Additional Notes from Agent | Long text | Optional |
| Agent Full Name | Text | Yes |
| Agent Phone Number | Phone | Yes |
| Agency Name | Text | Yes |

### 4.4 Conflict of Interest Declaration & Legal Acknowledgment (fields collected per actor)
| Field | Type | Required |
|-------|------|----------|
| Conflict Declaration — Yes/No | Toggle: "I confirm [Actor Name] is NOT currently appearing in any advertisement, campaign, or promotional content for a brand that directly competes with [Client/Brand Name]" | Yes — must select Yes to proceed |
| Agent Typed Signature (Full Legal Name) | Text | Yes |
| Signature Timestamp | Auto-generated | Auto |
| Agent IP Address at Submission | Auto-captured | Auto |
| Acknowledgment Checkbox | Checkbox | Yes — must be checked to submit |

---

## 5. SCREENS & FEATURES

### 5.1 Dashboard (Casting Director View)
- List of all active Booking Jobs
- Per job: total actors booked, number submitted, number pending, number overdue
- Quick-access button to view the booking sheet for any job
- Button to create a new Booking Job

### 5.2 Booking Job Detail Page
- Job name, shoot date, production company
- Table of all booked actors with columns:
  - Actor Name
  - Agent Name / Email
  - Request Sent (timestamp)
  - Deadline (timestamp)
  - **Countdown Timer** — live ticking clock showing time remaining until each agent's 24-hour deadline expires
  - Status badge: Pending (yellow) / Submitted (green) / Overdue (red)
- Button: **"Send Reminder"** — manually trigger a reminder email to a specific agent
- Button: **"View Booking Sheet"**
- Button: **"Add Actor"** — add more talent to an existing job

### 5.3 Countdown Timer Logic
- Timer starts when the agent request email is sent.
- Deadline = exactly 24 hours after email sent.
- Timer counts down in real time (HH:MM:SS or D:HH:MM format).
- When timer hits 00:00:00:
  - Actor's row status changes to **Overdue**
  - Row is flagged red on the booking sheet
  - Timer displays "OVERDUE" instead of continuing
- If agent submits before deadline, timer stops and status changes to **Submitted** (green).

### 5.4 Agent Form (External, No Login)
- Accessible via unique URL only
- Clean, mobile-responsive layout
- Actor's name pre-populated at the top (so agent knows who this is for)
- Deadline prominently displayed: "Please submit by [DATE/TIME]"
- All fields listed in Section 4.3
- Progress indicator showing completion %
- Submit button — disabled until all required fields are complete, conflict declaration is confirmed, AND legal acknowledgment is signed and checked
- Post-submission: confirmation page ("Thank you — your submission has been received.")
- If deadline has passed: form shows "This submission window has closed."

### 5.5 Conflict of Interest & Legal Indemnification Block (on Agent Form)

This section appears as the **final step** of the agent form, directly before the submit button. It must be completed in full before submission is permitted.

**Section Header displayed to agent:**
> ⚠️ CONFLICT OF INTEREST DECLARATION & BOOKING ACCEPTANCE

**Conflict Declaration (required toggle — agent must select "I Confirm" to proceed):**
> I, the undersigned agent, confirm and warrant that **[Actor Name]** is not currently appearing in, contracted for, or otherwise associated with any advertisement, campaign, or promotional material for any brand, product, or service that is in direct or indirect competition with **[Client/Brand Name]**.
>
> I further confirm that no such conflict exists to my knowledge as of the date of this submission, and that I have made all reasonable inquiries to verify this prior to submitting.

**Booking Acceptance (required toggle — agent must select "I Accept" to proceed):**
> I confirm that **[Actor Name]** accepts this booking for **[Job Name]** on **[Shoot Date]** and agrees to all terms and criteria provided by the Casting Director in connection with this production.

**Legal Indemnification Statement (displayed as read-only text — agent must check the acknowledgment box below it):**
> **LEGAL RESPONSIBILITY & INDEMNIFICATION**
>
> By signing below, I, the agent of record for [Actor Name], personally and on behalf of [Agency Name], accept full legal responsibility for any and all claims, damages, losses, costs, or liabilities — including legal fees — that may arise from any undisclosed conflict of interest, including but not limited to the actor's appearance in competing advertising or promotional campaigns.
>
> I expressly agree that the Casting Director, their company, production, and any affiliated parties shall bear no legal responsibility whatsoever for any conflict that arises as a result of information withheld, omitted, or unknown at the time of this submission. Full legal responsibility for any such conflict rests solely with the undersigned agent and their agency.
>
> This declaration constitutes a legally binding agreement. By typing my full legal name below, I acknowledge that I have read, understood, and agreed to all of the above.

**Acknowledgment Checkbox (required):**
> ☐ I have read and fully understand the Legal Responsibility & Indemnification statement above, and I accept all terms on behalf of myself and my agency.

**Electronic Signature Field (required — typed full name):**
> Full Legal Name (Electronic Signature): ___________________

**Auto-captured at submission (not shown to agent, stored in database):**
- Exact timestamp of submission (UTC)
- Agent's IP address
- Browser/device user agent string
- Unique form token used to access the form

### 5.6 Live Booking Sheet
- One row per actor
- Columns map directly to all fields in Sections 4.3 and 4.4
- Additional columns for legal record:
  - Conflict Declared (Yes/No)
  - Booking Accepted (Yes/No)
  - Legal Indemnification Signed (Yes/No)
  - E-Signature Name
  - Signature Timestamp
- Color coding:
  - Green row = Submitted
  - Yellow row = Pending (within deadline)
  - Red row = Overdue
- Last updated timestamp shown at top
- Exportable to CSV / Google Sheets sync
- Shareable read-only link for production team

### 5.7 Email Templates (Auto-Generated)
**Initial Booking Request Email:**
> Subject: ACTION REQUIRED — Talent Booking Information Needed by [DEADLINE]
>
> Hi [Agent Name],
>
> Congratulations — [Actor Name] has been booked for [Job Name].
>
> We require the following information within 24 hours. Please click the link below to submit:
>
> [UNIQUE FORM LINK]
>
> Deadline: [DATE + TIME — 24 hrs from now]
>
> Thank you,
> [Casting Director Name]

**Reminder Email (manual trigger):**
> Subject: REMINDER — Booking Info Still Needed for [Actor Name]
>
> Hi [Agent Name],
>
> We're still awaiting the submission for [Actor Name] for [Job Name].
>
> Time remaining: [X hours / OVERDUE]
>
> Please submit now: [FORM LINK]

---

## 6. COUNTDOWN TIMER — DETAILED BEHAVIOR

| State | Display | Row Color |
|-------|---------|-----------|
| Within 24 hrs, not submitted | Live countdown HH:MM:SS | Yellow |
| Submitted before deadline | "Submitted ✓" + timestamp | Green |
| Past 24 hrs, not submitted | "OVERDUE" | Red |
| Past 24 hrs, submitted late | "Submitted (Late)" + timestamp | Orange |

- Timers must persist through page refresh (based on stored timestamps, not client-side JS only).
- All times displayed in the casting director's local timezone.

---

## 7. GOOGLE SHEETS INTEGRATION

- When a Booking Job is created, the app auto-creates a linked Google Sheet.
- As agents submit forms, rows populate in real time via Google Sheets API.
- Sheet is pre-formatted with column headers matching Section 4.3 fields.
- Overdue rows auto-highlighted red in the sheet.
- Casting director can share the Google Sheet link directly with production.
- Sheet updates within 60 seconds of any new submission.

---

## 8. NOTIFICATIONS

| Trigger | Recipient | Channel |
|---------|-----------|---------|
| Form link sent | Agent | Email |
| Agent submits form | Casting Director | In-app + Email |
| Agent hits overdue status | Casting Director | In-app flag (red) |
| Manual reminder sent | Agent | Email |

---

## 9. LEGAL AUDIT TRAIL

Every agent submission must generate a permanent, tamper-evident legal record stored in the database. This record is the casting director's protection in the event of any dispute.

### 9.1 Per-Submission Legal Record (stored automatically)
| Data Point | Source |
|------------|--------|
| Agent full legal name (typed signature) | Form input |
| Agency name | Form input |
| Actor name | Pre-populated from booking |
| Job/production name | Pre-populated from booking |
| Client/brand name | Pre-populated from booking |
| Conflict declaration answer | Form toggle |
| Booking acceptance answer | Form toggle |
| Indemnification acknowledgment checked | Form checkbox |
| Submission timestamp (UTC) | Auto-captured |
| Agent IP address | Auto-captured |
| Browser/device user agent | Auto-captured |
| Unique form token used | Auto-captured |

### 9.2 Legal Record Access
- Casting Director can view the full legal record for any submission at any time from the Booking Job Detail page.
- Records are never deletable by any user — only archivable.
- Each submission generates a **PDF receipt** of the completed legal declaration, stored against the booking record and available for download.
- The PDF receipt must include: all fields above, the full text of the indemnification statement as it appeared on the form, and a confirmation that the agent checked the acknowledgment box and typed their signature.

### 9.3 Important Note for Casting Director
> **This app captures and stores agent declarations for your records. It is strongly recommended that you consult a lawyer to review the indemnification language before going live, to ensure it is enforceable in your jurisdiction.**

---

## 10. TECHNICAL REQUIREMENTS

- **Authentication:** Casting Director login (email + password or Google OAuth)
- **Agent forms:** No authentication — unique token-based URL per actor
- **Form links:** Expire after submission OR after 48 hours (configurable)
- **Data storage:** All submissions stored in app database and synced to Google Sheets
- **Legal records:** Stored permanently, never deletable, PDF receipt auto-generated per submission
- **Timezone handling:** Store all timestamps in UTC, display in user's local timezone
- **Mobile responsive:** Agent form must work perfectly on mobile
- **Security:** Form tokens must be non-guessable (UUID or equivalent)

---

## 11. OUT OF SCOPE (V1)

- SMS/text notifications to agents
- Actor self-submission (agent only in V1)
- Payment or contract processing
- Availability checking
- Integration with casting databases (Breakdown Services, etc.)

---

## 12. SUCCESS CRITERIA

- Casting director can create a booking job and blast all agent requests in under 5 minutes
- Agent can complete and submit form on mobile in under 3 minutes
- Booking sheet populates within 60 seconds of agent submission
- All overdue statuses accurately reflect 24-hour deadline with no manual intervention
- Production can view a fully populated booking sheet without contacting the casting director
- Every submission generates a stored legal record and downloadable PDF receipt
- Casting director is fully removed from legal liability for undisclosed conflicts

---

*End of PRD v2.0*

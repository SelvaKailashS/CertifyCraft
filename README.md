# CertifyCraft Studio 🎓📜

> **Automated, High-Resolution Certificate Generation & Tamper-Proof Cryptographic Verification**

![CertifyCraft Studio](https://raw.githubusercontent.com/SelvaKailashS/CertifyCraft/main/public/preview.png)

CertifyCraft is an enterprise-grade certificate generator and verification workbench built with React, TypeScript, Tailwind CSS, and Vite. Designed for hackathons, universities, bootcamps, and conferences to issue thousands of personalized, verifiable credentials in seconds.

---

## ✨ Features

- 🖥️ **Interactive 1920×1080 Vector Canvas**:
  - Drag and drop text fields, labels, and QR elements directly on the certificate template with live coordinate tracking (`[+ X%, Y%]`).
  - Alignment grid overlay with snapping guide lines.
  - View scaling: `Fit`, `75%`, `100%` modes.

- 🎛️ **Three-Tab Studio Workbench**:
  - **Inspector**: Real-time control of typography (Cinzel Serif, Inter Sans, Playfair Display, Montserrat, Great Vibes, Orbitron), font weights, sizes, alignments, text case, and color swatches.
  - **Participants**: Multi-format `.xlsx`, `.xls`, `.csv` spreadsheet upload, pre-loaded demo roster, instant 4,000 students stress-test generator, and smart column auto-mapping.
  - **Templates**: 4 stunning built-in vector themes (*CodeSprint Hackathon*, *Athletic Sports Trophy*, *Tech Workshop & Summit*, *Collegiate Honor & Academic*) + Custom SVG/image template upload.

- 🛡️ **Cryptographic QR Verifier Portal**:
  - Scannable dynamic QR codes on every certificate linking to tamper-proof verification URLs.
  - Public verifier registry with SHA-256 integrity checksums and issuance verification.

- ⚡ **Make.com & Zapier Automation**:
  - Webhook URL integration with sample JSON dispatch payload inspection and live test runner for automatic email delivery.

- 📦 **Bulk Export Engine**:
  - Client-side rendering and compression of individual PNG/PDF certificates into `.zip` archives.
  - Instant single-student PDF and PNG exports.
  - Formatted sample Excel download (`.xlsx`).

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/SelvaKailashS/CertifyCraft.git

# Navigate to project directory
cd CertifyCraft

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Deploy to Vercel

CertifyCraft is pre-configured with `vercel.json` for zero-config deployment:

```bash
# Deploy with Vercel CLI
npx vercel
```

Or connect the repository on [Vercel Dashboard](https://vercel.com/) and click **Deploy**.

---

## 📄 License

MIT © [SelvaKailashS](https://github.com/SelvaKailashS)

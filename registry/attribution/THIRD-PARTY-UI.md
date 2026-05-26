# Third-Party UI Legal Attribution

This file tracks all third-party open-source components, blocks, styles, or hooks copied, adapted, or inspired by permissive open-source repositories for `rahul-boilerplate`.

---

## Registry Item: use-mobile
* **Target Path**: `registry/hooks/use-mobile.ts`
* **Original Source Repository**: https://github.com/jiaweing/DropDrawer
* **Original License**: MIT License
* **Original Author/Copyright Holder**: Copyright (c) 2026 Jia Wei Ng
* **Adaptation Decision**: Copied
* **Modification Details**: Used standard mobile breakpoint (768px) and React Hooks compatibility rules.

### Original Copyright Text
```text
MIT License

Copyright (c) 2026 Jia Wei Ng

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
```

---

## Registry Item: auth-login-card
* **Target Path**: `registry/blocks/auth/auth-login-card.tsx`
* **Original Source Repository**: https://github.com/Kiranism/next-shadcn-dashboard-starter
* **Original License**: MIT License
* **Original Author/Copyright Holder**: Copyright (c) 2023 Kiranism
* **Adaptation Decision**: Adapted
* **Modification Details**: 
  - Refactored component layout to fit React 19.
  - Substituted Next.js navigation hooks (`next/navigation`) with standard React Router / HTML structures.
  - Substituted Clerk Auth imports with clean Better Auth client forms (using standard forms resolvers, Google/GitHub OAuth integrations, and Zod validations).
  - Formatted styles using custom Tailwind v4 CSS variables.

### Original Copyright Text
```text
MIT License

Copyright (c) 2023 Kiranism

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
```

---

## Registry Item: landing-saas-home
* **Target Path**: `registry/blocks/landing/landing-saas-home.tsx`
* **Original Source Repository**: https://github.com/techwithanirudh/shadcn-saas-landing
* **Original License**: MIT License
* **Original Author/Copyright Holder**: Copyright (c) 2025 Anirudh
* **Adaptation Decision**: Adapted
* **Modification Details**:
  - Extracted the SaaS Hero, Bento Features Grid, CTA Banner, and tabbed Pricing card layouts.
  - Rewrote custom animation classes into standard CSS transitions under Tailwind v4.
  - Decoupled Next.js Link utilities in favor of React Router v7 links or plain `<a>` tags.
  - Adjusted image grids to use responsive standard `<img>` assets instead of `next/image` layout wrappers.

### Original Copyright Text
```text
MIT License

Copyright (c) 2025 Anirudh

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
```

---

## Registry Item: dashboard-sidebar-layout
* **Target Path**: `registry/blocks/dashboard/dashboard-sidebar-layout.tsx`
* **Original Source Repository**: https://github.com/satnaing/shadcn-admin
* **Original License**: MIT License
* **Original Author/Copyright Holder**: Copyright (c) 2024 Sat Naing
* **Adaptation Decision**: Adapted
* **Modification Details**:
  - Integrated collapsible `@components/ui/sidebar` system components into a standalone reusable block.
  - Refactored routing triggers from TanStack Router hooks (`@tanstack/react-router`) to standard React Router v7 dynamic paths and `Link` utilities.
  - Styled with HSL tailwind v4 color variables.
  - Added clean responsive sub-menus and user nav footers.

### Original Copyright Text
```text
MIT License

Copyright (c) 2024 Sat Naing

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
```

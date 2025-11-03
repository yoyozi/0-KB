# Developer Knowledge Base

A searchable knowledge base website built with Next.js 15 and React 19. This application transforms markdown files into a beautiful, searchable documentation site.

## Features

- 📝 **Markdown Support**: All your `.md` files are automatically indexed and rendered
- 🔍 **Search Functionality**: Search through all your documentation
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Static generation for optimal speed
- 🔒 **Private**: No public indexing (robots.txt configured)
- 💻 **Syntax Highlighting**: Code blocks with syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
0-KB/
├── app/                    # Next.js App Router
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── articles/          # Articles pages
│   │   ├── page.jsx       # Articles list
│   │   └── [slug]/        # Individual article pages
│   ├── search/            # Search page
│   └── api/               # API routes
│       └── search/        # Search API endpoint
├── components/            # React components
├── lib/                   # Utilities
│   └── markdown.js        # Markdown processing utilities
├── public/                # Static assets
├── styles/                # Additional styles
├── *.md                   # Your markdown files (content)
└── refactor.md           # Development roadmap
```

## Adding Content

Simply add markdown files (`.md`) to the root directory. They will be automatically:

1. Indexed and made searchable
2. Available at `/articles/[filename-slug]`
3. Listed on the articles page

### Filename Convention

Files like `00-Topic-Version.md` will be parsed as:
- **Slug**: `00-topic-version`
- **Title**: Extracted from filename or frontmatter

### Frontmatter (Optional)

You can add metadata to your markdown files:

```markdown
---
title: "Custom Title"
excerpt: "Custom excerpt for search results"
tags: ["javascript", "react", "nextjs"]
date: 2024-01-01
---

# Your content here
```

## Search

The current search implementation uses simple text matching. Future enhancements will include:

- Vector database integration (Pinecone/Qdrant)
- Semantic search with embeddings
- Advanced filtering and sorting

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Linode. Key considerations:

1. Set environment variables in `.env.local`
2. Build the project: `npm run build`
3. Deploy the `.next` folder and dependencies
4. Run with `npm start`

## Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_SITE_NAME="Developer Knowledge Base"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Next.js Configuration

See `next.config.js` for:
- Markdown file handling
- No-index headers (privacy)
- Build optimizations

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Markdown**: gray-matter, remark, rehype
- **Syntax Highlighting**: rehype-highlight

## Roadmap

See `refactor.md` for the complete development roadmap and progress tracking.

## License

Private project - not for public distribution.

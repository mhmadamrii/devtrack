# DevTrack - Project Management Tool

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

## 📋 Overview

DevTrack is an open-source project management tool built to help teams track
tasks, manage projects, and collaborate effectively. This project was initially
created to address the need for a project management solution at Rastek.ID, but
is now available for anyone to use, modify, or extend.

![DevTrack Screenshot](https://oyluendsrr.ufs.sh/f/heCK4TZGuZCFQW2drmXNZgGW72RDTc1yFPp4VQstmzjXbOxS)

<!-- Replace with an actual screenshot when available -->

## ✨ Features

- **Project Management**: Create and manage multiple projects
- **Issue Tracking**: Create, assign, and track issues with priorities and
  statuses
- **Team Collaboration**: Assign team members to projects and issues
- **Real-time Updates**: See changes as they happen
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and Shadcn
  UI
- **Secure Authentication**: User authentication and authorization

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://github.com/better-auth/better-auth)
- **API**: [tRPC](https://trpc.io/) for type-safe APIs
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or newer)
- PostgreSQL database
- pnpm package manager

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/mhmadamrii/devtrack.git
   cd devtrack
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   ```

   Then edit the `.env` file with your database credentials and other settings.

4. Set up the database

   ```bash
   pnpm db:push
   ```

5. Start the development server

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Documentation

For more detailed documentation on how to use and extend DevTrack, please refer
to the [Wiki](https://github.com/mhmadamrii/devtrack/wiki) (coming soon).

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these
steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

If you have a feature request or found a bug, please open an issue on GitHub.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [tRPC](https://trpc.io/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Better Auth](https://github.com/better-auth/better-auth)

## 📬 Contact

If you have any questions or feedback, please reach out to us by
[opening an issue](https://github.com/mhmadamrii/devtrack/issues) on GitHub.

---

<p align="center">Made with ❤️ at Rastek.ID</p>

## 📋 Roadmap

- Dashboard with statistics of projects and team member performance
- Hover card for assignee profile information
- Pagination for issues and projects lists
- Email notifications for issue assignments and updates
- Time tracking for issues
- File attachments for issues
- Advanced reporting and analytics

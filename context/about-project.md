## Project idea

A web app where users learn the most useful Linux commands in two steps: they read short lessons in the docs, then practice immediately in an in-browser terminal by completing hands-on assignments. Each assignment is checked automatically, and progress is saved per user.

## Goals

1. **Teach by doing:** every lesson links to a real terminal where the user can try the command right away.
2. **Safe, instant practice:** commands run in a sandboxed bash (just-bash) inside the browser, with nothing to install and no risk to a real system.
3. **Automatic feedback:** assignments are validated against the resulting state (files, output, exit code), so any valid solution passes.
4. **Track progress:** users sign in, complete assignments, and see what they've finished.
5. **Easy to grow:** lessons and assignments are files in GitHub, so adding content is a commit, and the sandbox can later be swapped for real Linux.

## Features

**Accounts**

- Sign up and sign in with Clerk.
- User profile row created automatically via Clerk webhook.

**Lessons**

- One lesson page per command, written in MDX.
- Lessons grouped into tracks: navigation, files, text processing, permissions, pipes/redirects.
- Sidebar navigation with track and lesson order.
- Custom lesson components: callouts, command examples with expected output.
- "Try it" button in a lesson that opens the terminal with the command prefilled.
- Mark lessons as read.

**Terminal**

- In-browser terminal (xterm.js) running a sandboxed bash (just-bash) with a virtual filesystem.
- Support for pipes, redirects, variables, and common commands (`ls`, `cd`, `cat`, `grep`, `echo`, `printf`, and more).
- Command history (↑/↓), Ctrl+C, and proper prompt behavior.
- Runs in a Web Worker, so a bad command can't freeze the page.

**File editor**

- CodeMirror panel for assignments that involve editing a file.
- `edit <file>` command opens the file in the panel; saves write back to the virtual filesystem.

**Assignments**

- Each assignment has instructions, a starting filesystem, and automatic validation.
- Validation checks the final state (files, output, exit code), so any valid solution passes.
- Buttons: Check, Reset, and Hint.
- Clear pass/fail feedback after checking.

**Progress**

- Completed assignments saved per user.
- Server-side re-verification before an assignment is marked complete.
- Progress indicator per track and per lesson.

## Out of scope

- Real Linux execution (VMs, containers, WebVM). The sandbox is just-bash only. A real-Linux track is a later option behind the `Sandbox` interface.
- Commands just-bash can't run: `ps`, `top`, `kill`, `systemctl`, `sudo`, `apt`, `ssh`, `git`, and anything needing real processes, services, or binaries.
- Leaderboards, certificates, and badges, which means no need for strong anti-cheat beyond the server replay check.
- Timed challenges and competitions.
- Community-written lessons or assignments via pull requests.
- An admin panel or CMS for editing content. Content is edited in GitHub.
- A native mobile app. The site is responsive web only, with a key bar for the terminal.
- Offline mode.

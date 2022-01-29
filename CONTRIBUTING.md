Thanks for your interest in contributing to Hours! There are many avenues to improve the app, including building new features, fixing bugs, implementing analytics, making it work at other universities, and much more.

This guide will walk you through everything you need to know to get started.

## The Codebase
The codebase is split into two repositories: [hours-frontend](https://github.com/nthnluu/hours-frontend) and [hours-backend](https://github.com/nthnluu/hours-backend). The frontend is a React (Next.js) app written in Typescript, while the backend is a REST API written in Go. We also use Firebase Authentication and Firestore.

## Issues and Bug Reports
To report an issue or bug report:
- Open an issue and describe the problem along with the conditions under which you faced it, and any steps to reproduce the bug.
- Contribute to discussion from maintainers and other contributors.
- If you'd like to help fix the issue, ask to be assigned the task. A maintainer will help you get setup and guide you through the fix.

## Pull Requests
We have two different workflows, one for maintainers, one for external contributors. Maintainers work within the primary repo, whereas external contributors fork the repo into their own, and open pull requests back into master.

Both begin by setting up the repo and running Hours locally.

### Setup
1. Install [Node.js](https://nodejs.org/en/) and [Go](https://go.dev/dl/).
2. Create a Firebase project and create a web app. Ensure Firestore and Firebase Authentication are set up. Save the credentials for later.
3. If you're a maintainer, clone this repository. Otherwise, fork it. Then, install dependencies:
```bash=
git clone https://github.com/nthnluu/hours-frontend
cd hours-frontend
npm install -g yarn
yarn install
```
4. Copy `example.env` and copy over the corresponding Firebase credentials from earlier. For the last environment variable, set it to `http://localhost:8080/v1`.
5. Same as before, clone/fork the [hours-backend](https://github.com/nthnluu/hours-backend) repo. Then, install dependencies:
```bash=
https://github.com/nthnluu/hours-backend
cd hours-backend
go mod tidy
```
6. In the Firebase console, go to **Project Settings > Service Accounts** and generate a new private key. Take the downloaded JSON file, rename it to `dev-firebase-config.js`, and move it into the root of the newly cloned hours-backend directory.
7. Run the backend:
```bash=
cd hours-backend
go run main.go
```
8. Run the frontend:
```bash=
cd hours-frontend
yarn dev
```

## Development
We follow a pretty simple workflow, with two primary branches:
- `main` represents the publicly deployed version (available at [https://hours.cs.brown.edu](https://hours.cs.brown.edu)).
- `staging` represents the publicly deployed staging version (available at [https://hours-staging.luu.dev](https://hours-staging.luu.dev)).

All changes to `main` must be merged via pull request from `staging`. In addition, we require two code reviews and code owner approval before pushing to `main`. 

For small bug fixes and features, feel free to directly push to `staging`. When working on anything larger:
1. Branch off of master `main` into something like `feature/my-feature-name`.
2. While developing, if you need to pull in changes to your branch that occurred after branching, use `git rebase main`.
3. Once finished developing your feature, push to GitHub, and open a pull request to the `staging` branch.
4. Get feedback from other developers. You can continue pushing commits to the branch; these will be automatically reflected in the pull request.
5. Once approved, merge into `staging`. Move on to developing something new.

If fixing a bug in production:
1. Branch off `main` into something like `hotfix/fix-this-bug`.
2. Once ready, push to GitHub, and open a pull request into `main`.
3. Once approved, merge the pull request. Then merge `main` into `staging` so both branches are up to date.

## Writing Quality Commit Messages
When committing changes, there are a few important points to remember:
- Use the imperative form. Instead of writing `fixed bug`, write `fix bug`. This convention is helpful as it describes what will happen after your commit is applied.
- Write concise, descriptive messages about what changes were made and why. For example, prefer `Fix failing server call in createTicket` over `got createTicket to work!`.
- Reference issue numbers correctly. For example, `Fix #178: Fix card creation bug`.

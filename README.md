<img src="https://raw.githubusercontent.com/nthnluu/no-bs-react/main/public/nobs_react_cover.png" alt=""/>

<h1 align="center">No-BS React 🔥</h1>

<div align="center">
 <b>
  No-BS React is a production-ready React boilerplate that lets you spend less time on tedious setup and more time building accessible, modular, and well-tested features.
 </b>
</div>

## Tech Stack 🥞
* ⚛️ [**Next.js**](https://nextjs.org/docs) - a developer-friendly React framework for building web apps.
* 🎨 [**Material UI**](https://next.material-ui.com/) - an extensive and themeable React component library.
* 📚 [**Storybook**](https://storybook.js.org/docs/react) - a tool for building, browsing, and documenting UI components in isolation.
* 🧪 [**Jest**](https://jestjs.io/) - a Javascript unit testing library.
* 🔬 [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/) - a lightweight utility library for unit testing React components.

## Getting Started 🤓

### Installation
Ensure you have the latest version of [**Node.js**](https://nodejs.org/en/) installed.

First, clone the repository:
```bash
git clone https://github.com/nthnluu/no-bs-react
```

Then, install the required dependencies:

```bash
cd no-bs-react
yarn install
```

Finally, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

### Create a new component
If you browse the `src/components` directory, you'll notice how each component has its own directory containing a number of files:
* `SampleComponent` (SampleComponent obviously represents some arbitrary component)
  * `SampleComponent.tsx` - the React component code.
  * `SampleComponent.test.tsx` - the unit tests for the component.
  * `SampleComponent.stories.tsx` - the Storybook [stories](https://storybook.js.org/docs/react/get-started/whats-a-story) for the component.
  * `index.tsx` - a file that marks the component as the default export for the directory (you won't need to modify this file).

Of course, manually creating all these files is a whole lot of tedious work that takes away from your awesome feature-building productivity. Therefore, you're provided with a simple command line tool that can generate all of these files for you:
```bash
yarn add-component SampleComponent
```

This will generate a new component directory into `src/components`. You can move it into any directory within `src/components` as you see fit.

### Explore components via Storybook
Storybook is an insanely useful tool for develping and exploring components in isolation. Through the Storybook UI, you can view the documentation (generated from docstrings) and the props of your project's components. To launch Storybook, simple run:
```bash
yarn storybook
```

and open [http://localhost:6006](http://localhost:6006) with your browser.

## Learn More ✌️

Now that you're all caught up on the basics, it's time for you to start bringing your idea to life:

- 🔒 [**User Authentication**](https://nextjs.org/docs) - implement authentication from any provider into your project.
- 🤖 [**API Connection**](https://nextjs.org/learn) - integrate APIs in a modular and extensible way.
- 📱 [**Building your UI**](https://nextjs.org/learn) - build an accesible and optimzed UI.
- 🌈 [**Themes and Styles**](https://nextjs.org/learn) - customize the look and feel of your application.
- 🌎 [**Deployment**](https://nextjs.org/learn) - bring your app online for the world to see.

Those are just the highlights! Check out our [**wiki**](https://github.com/nthnluu/no-bs-react/wiki) for the full documentation.

## 🛠 Contributing

Do you want to help us build the best React boilerplate ever? Awesome! Get started by reading our contributor guide.

## License
This project is licensed under the terms of the MIT license.

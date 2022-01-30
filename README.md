<img src="https://i.imgur.com/tNHmFW3.png" alt=""/>

<h1 align="center">Hours Frontend</h1>

<div align="center">
 <b>
  The frontend for Hours — a real-time office hour management system used at Brown University.
 </b>
</div>

## Tech Stack 🥞

* ⚛️ [**Next.js**](https://nextjs.org/docs) - a developer-friendly React framework for building web apps.
* 🎨 [**Material UI**](https://next.material-ui.com/) - an extensive and themeable React component library.
* 🧪 [**Jest**](https://jestjs.io/) - a Javascript unit testing library.
* 🔬 [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/) - a lightweight utility
  library for unit testing React components.

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

If you browse the `src/components` directory, you'll notice how each component has its own directory containing a number
of files:

* `SampleComponent` (SampleComponent obviously represents some arbitrary component)
    * `SampleComponent.tsx` - the React component code.
    * `SampleComponent.test.tsx` - the unit tests for the component.
    * `index.tsx` - a file that marks the component as the default export for the directory (you won't need to modify
      this file).

Of course, manually creating all these files is a lot of tedious work. Therefore, you're provided with a simple command
line tool that can generate all of these files for you:

```bash
yarn add-component SampleComponent
```

This will generate a new component directory into `src/components`. You can move it into any directory
within `src/components` as you see fit.

## 🛠 Contributing

Want to help make Hours even better? Awesome! Get started by reading
our [contributor guide](https://github.com/nthnluu/hours-frontend/blob/main/CONTRIBUTING.md).

## License

This project is licensed under the terms of the MIT license.

# Changemakers-Map

## Technologies

This project is built with the following technologies:

- [Svelte](https://svelte.dev) v4.2.3: JavaScript framework for building user interfaces.
- [Vite](https://vitejs.dev) v5.0.0: Build tool with out-of-the-box support for Svelte.
- [Tailwind CSS](https://tailwindcss.com) v3.3.5: Utility-first CSS framework for building custom designs.
- [CytoscapeJS](https://js.cytoscape.org) v3.27.0: Graph library for visualisation.
- [Leaflet](https://leafletjs.com) v1.9.4: Open-source library for interactive maps.
- [Datatables](https://vincjo.fr/datatables) v1.14.1: A toolkit for creating datatable components with Svelte.

## Getting Started

### Prerequisites

- Node v18.18.2 or any v20

### Installation

```
git clone [repository URL]
cd [project directory]
yarn install
```

### Running the Application

```
yarn dev
```
This will start the local server, by default at http://localhost:5173. The application will automatically reload if you change any of the source files.

### Code Linting

```
yarn lint
```
This will lint all JavaScript code in all .js and .svelte files. It will automatically fix all the common issues and provide a list of errors and warnings for more complex ones.

### Building for Production

```
yarn build
```
This command will create a `dist` folder with all the files optimized for production. This `dist` folder will contain all the files needed to start and run the application.

## Updating the Data

This section provides guidance on updating and managing the five CSV files that serve as the backbone of the data structure.

The files are located in `public/data`. After the build process, these files are directly cloned into the resulting directory. To update them simply change the files in both `public/data` and result directories.

The files are `leaders.csv`, `projects.csv`, `links.csv`, `tags.csv`, and `locations.csv`. Each file has a specific format and role in the overall data architecture.

1. Leaders File
Purpose: Contains information about the leaders, serving as nodes in the result graph.
Columns:
- id: Unique identifier for each leader.
- name: Name of the leader.
- project: Projects associated with the leader.

*Note*: Projects are listed in a specific syntax, e.g., "0. Project Name 1, 1. Project Name 2". Each project is enumerated and separated by a comma.

2. Projects File
Purpose: Details all the projects.
Columns:
- id: Unique identifier for each project.
- name: Name of the project.
- description: Brief description of the project.
- problem: List of tag IDs that relate to the project.
- address: Location of the project.
- year: Year of the project.

*Note*: The problem column should contain IDs that correspond to tags in the tags file.

3. Tags File
Purpose: Provides details about the tags referenced in projects.
Columns:
- id: Unique identifier for each tag.
- text: Text description of the tag.
- cluster: The cluster or category to which the tag belongs.

*Note*: there is a predefined list of colors used for clusters. If any other cluster is added the following should be performed: (1) add new color value to `GraphColors` array in `src/lib/utils.js` file; (2) rebuild and redeploy the project.

4. Links File
Purpose: Used to establish graph edges between nodes.
Columns:
- source: The source ID from the leaders file.
- target: The target ID from the leaders file.

5. Locations File
Purpose: Maps project addresses to coordinates.
Columns:
- name: Name or identifier of the location.
- lat: Latitude coordinate.
- lng: Longitude coordinate.

*Note*: file list should be updated if any new address appears in projects.

### Important Notes:

1. Data Consistency: Ensure that all IDs and references across files are consistent and accurate.

2. CSV Format: Maintain the CSV format strictly, the columns delimeter should be `;`.

## Managing Locales

### Registered Locales

1. English (En)
- Operated with en.json file located in src/locales directory.
- en.json serves as the primary reference for all the texts and keys.

2. Indonesian (Id)
- Operated with id.json file located in the same directory.
- Uses the same keys as in en.json.

### Steps to Change Locale Texts

1. Edit Locale Files. Modify the necessary keys in the respective .json files within the src/locales directory.

2. Rebuild and Redeploy. After editing, rebuild and redeploy the project to apply changes.

*Important note*: `list.counter` is a template string. Do not remove or change `{start}`, `{end}` and `{total}` as they are variable names.

## Setting Sharing URL

To correctly configure sharing it's essential to set the final URL of the application in two specific locations:

- `VITE_URL` string in .env file;
- `og:image` and `twitter:image` meta tags in index.html file.

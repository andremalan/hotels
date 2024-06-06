# Hotels

An API to return cleaned hotel data from various sources.

### Relevant code

- `app/models` contains all the models
- `app/routes` defines the various endpoints
- `app/services` has all the code realated to extracting and transforming code from suppliers.

## Development

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial setup:

  ```sh
  npm run setup
  ```

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

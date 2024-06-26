
<div align="center">
  
  <h1>Feathers Quasar Boilerplate</h1>
  
  ![Project Banner](./readme_assets/readme_banner.png)

  <p>
    <a href="https://codeclimate.com/github/tristan-greffe/feathers-quasar-boilerplate">
      <img src="https://codeclimate.com/github/tristan-greffe/feathers-quasar-boilerplate/badges/gpa.svg" alt="maintainability" />
    </a>
    <a href="https://github.com/tristan-greffe/feathers-quasar-boilerplate/stargazers">
      <img src="https://img.shields.io/github/stars/tristan-greffe/feathers-quasar-boilerplate" alt="stars" />
    </a>
    <a href="https://github.com/tristan-greffe/feathers-quasar-boilerplate/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/tristan-greffe/feathers-quasar-boilerplate.svg" alt="license" />
    </a>
  </p>

 <h4>
    <a href="https://github.com/tristan-greffe/feathers-quasar-boilerplate/issues/">Report Bug</a>
    <span> · </span>
    <a href="https://github.com/tristan-greffe/feathers-quasar-boilerplate/issues/">Request Feature</a>
  </h4>

</div>

## About the Project

<div align="center">
  <img src="./readme_assets/boilerplate.png" height="auto" width="90%"/>
</div>

This boilerplate, inspired by [Kalisio](https://github.com/kalisio), is an application based on the **[FeathersJS](https://feathersjs.com/)** & **[QuasarJS](https://quasar.dev/)** frameworks for visualizing weather data in real time.

### Tech Stack

[![My Skills](https://skillicons.dev/icons?i=js,vue,mongo,yarn,docker,kubernetes)](https://skillicons.dev)

### Features

1. Weather data visualization with [OpenWeathers](https://openweathermap.org/)

2. Interactive map: the interactive map is based on [Leaflet](https://leafletjs.com/), a powerful mapping framework.

3. Full authentication with [feathers-authentication-management](https://feathers-a-m.netlify.app/)

## Getting Started

### Step 1: set the required environment variables

| ENV | Description | Required |
|---|---|---|
| `GMAIL_USER` | Email used for gmail account | yes |
| `GMAIL_PASWORD` |  Password for gmail account | yes |
| `GOOGLE_CLIENT_ID` | Customer ID for google authentication | no |
| `GOOGLE_CLIENT_SECRET` | Customer secret key for google authentication | no |

### Step 2: installing

#### From source code

```sh
git clone https://github.com/tristan-greffe/feathers-quasar-boilerplate.git

// Run the server/API
cd feathers-quasar-boilerplate/api
yarn install
yarn dev

// In another terminal run the client app
cd feathers-quasar-boilerplate
yarn install
yarn dev
```

> [!NOTE]
> Then point your browser to localhost:8080

#### Using minikube

##### Requirements

- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Helm](https://helm.sh/docs/intro/install/)

##### Getting started

1. **Start Minikube** :
   ```sh
   minikube start
   ```

2. **Navigate to `k8s` directory** :
   ```sh
   cd k8s
   ```

3. **Run the installation script** :
   ```sh
   ./install.sh
   ```

##### Accessing applications

- **Feathers Quasar Boilerplate** :
  - Open your browser and go to : `http://<minikube-ip>:30001`
  
- **Mongo Express** :
  - Open your browser and go to : `http://<minikube-ip>:30000`
  - Authentication :
    - Username : `admin`
    - Password : `admin`

> [!NOTE]
> To obtain Minikube's IP address, run the following command :
> ```sh
> minikube ip
> ```

### Testing

#### API
From the root folder run the server-side tests:

```sh
$yarn test:server
```

> [!IMPORTANT]
> To run the server-side tests, the server must not be running.

#### Client
From the root folder run the client-side tests:

```sh
$yarn test:client
```

> [!IMPORTANT]
> To run the client-side tests, you must first run the web app.

## Contributing

Contributions are always welcome!

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork it! 🤙

2. Create your feature branch: `git checkout -b my-new-feature`

3. Commit your changes: `git commit -m "Add some feature"`

4. Push to the branch: `git push origin my-new-feature`

5. Submit a pull request 👍

## License

This project is licensed under the MIT License - see the [license file](./LICENSE) for details

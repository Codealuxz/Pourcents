# Les Pourcents

Website of the **Les Pourcents** clan, built with React, Vite and react-three-fiber for the 3D scenes.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Docker

The site ships with a Dockerfile (static build served by nginx):

```bash
docker build -t pourcents .
docker run -p 8080:80 pourcents
```

## Stack

- React 19 + Vite
- react-three-fiber / drei for 3D
- nginx + Docker for deployment

# QuickLock FE

QuickLock FE is an Expo + React Native frontend for a smart lock system. It provides authentication, lock access, lock status polling, lock/unlock actions, activity views, and admin-oriented device and user management screens.

## Tech stack

- Expo SDK 54
- React Native 0.81
- React 19
- Expo Router for file-based navigation
- Axios and `fetch` for API requests
- `expo-secure-store` for token storage on native devices

## Main app flow

- `app/index.tsx`: welcome screen with login and sign-up entry points
- `app/login.tsx` and `app/sign-up.tsx`: authenticate the user and persist tokens
- `app/home.tsx`: shows the main lock card, polls lock status, and triggers lock/unlock
- `app/account.tsx`, `app/activity-log.tsx`, `app/users.tsx`, `app/share-access.tsx`, `app/settings.tsx`, `app/devices.tsx`: supporting account, audit, and admin flows

Navigation is defined in `app/_layout.tsx` using Expo Router stack screens.

## API configuration

The app is currently pointed at the deployed backend:

```ts
https://quicklock-be.onrender.com
```

This is defined in [config/api.js](/C:/Users/ads80408/Development/QuickLock-FE/config/api.js).

There is also a commented local-development option that uses `EXPO_PUBLIC_IP_ADDRESS` from `.env`.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. If you want to use a local backend, create a `.env` file based on `.env.example` and update `config/api.js` to use the local `BASE_URL`.

3. Start the app:

```bash
npm run start
```

You can also run:

- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`

## Notes

- Access and refresh tokens are stored in `localStorage` on web and `expo-secure-store` on native.
- The selected lock ID is also persisted locally and reused by the home screen.
- Some admin/device flows appear to be in progress, so not every screen is fully wired yet.

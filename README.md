# Pokedex

A cross-platform mobile application built with **React Native (Expo)** and **TypeScript** that browses Pokémon data from the public [PokéAPI](https://pokeapi.co). It provides an infinite, searchable catalogue of every Pokémon, detailed stat pages, a persistent favourites list, and full light/dark theming.

The app is built around the four core requirements of robust data fetching: **fetch**, **display**, **loading states**, and **graceful error handling**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [APIs Used](#apis-used)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture Notes](#architecture-notes)
- [Configuration](#configuration)

---

## Features

- **Browse** every Pokémon (1,300+) in a two-column grid with infinite scroll and pull-to-refresh.
- **Search** the full Pokedex by name (client-side filtering over a cached index).
- **Detail view** with official artwork, type-themed header, base stats, abilities, height, weight, and base experience.
- **Favourites** that persist across app restarts.
- **Light / dark theme** that follows the operating system by default and can be toggled in-app.
- **Loading states** via animated skeleton placeholders.
- **Error handling** with typed, contextual messages and a retry action.
- **Animations** throughout (staggered list entrances, animated stat bars, springy interactions).

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | [Expo](https://expo.dev) (SDK 56) |
| Language | [TypeScript](https://www.typescriptlang.org) (strict mode) |
| UI | React Native 0.85 · React 19 |
| Navigation | [React Navigation 7](https://reactnavigation.org) (bottom tabs + native stack) |
| Server state | [TanStack React Query 5](https://tanstack.com/query) (caching, pagination, retries) |
| Client state | [Zustand 5](https://github.com/pmndrs/zustand) with persistence (AsyncStorage) |
| Images | [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) |
| Styling | [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) + native StyleSheet |

---

## APIs Used

All data is sourced from free, public APIs. **No API key, account, or `.env` configuration is required.**

### 1. PokéAPI — `https://pokeapi.co/api/v2`

The primary REST data source for all Pokémon information.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/pokemon?limit={limit}&offset={offset}` | Paginated list of Pokémon (used for the infinite-scroll grid; 24 per page). |
| `GET` | `/pokemon?limit=20000&offset=0` | Full Pokémon index (names + URLs), fetched once and cached to power search. |
| `GET` | `/pokemon/{id or name}` | Full detail for a single Pokémon: types, stats, abilities, height, weight, base experience. |

- **Base URL:** `https://pokeapi.co/api/v2`
- **Authentication:** None
- **Documentation:** https://pokeapi.co/docs/v2
- **Rate limits:** Fair-use; the app caches aggressively to minimise requests.

### 2. PokéAPI Sprites (GitHub) — `https://raw.githubusercontent.com/PokeAPI/sprites`

High-resolution official artwork, served as static images from the PokéAPI sprites repository.

| Method | URL pattern | Purpose |
| --- | --- | --- |
| `GET` | `/master/sprites/pokemon/other/official-artwork/{id}.png` | Official artwork for a Pokémon, derived directly from its dex id. |

- **Authentication:** None
- **Source repository:** https://github.com/PokeAPI/sprites

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [**Node.js**](https://nodejs.org) version 18 or later (LTS recommended)
- **npm** (bundled with Node.js)
- One of the following to run the app:
  - The [**Expo Go**](https://expo.dev/go) app on a physical iOS/Android device, **or**
  - An **Android emulator** ([Android Studio](https://developer.android.com/studio)), **or**
  - An **iOS simulator** (Xcode, macOS only), **or**
  - A modern **web browser** (for the web target)

> Full environment setup guide: https://docs.expo.dev/get-started/set-up-your-environment/

---

## Setup & Installation

```bash
# 1. Clone the repository
git clone <your-repository-url>

# 2. Move into the project directory
cd pokedex

# 3. Install dependencies
npm install
```

That's it — no environment variables or API keys to configure.

---

## Running the App

Start the Expo development server:

```bash
npm start
```

This opens the Expo Dev Tools and prints a QR code. From there you can:

- **Physical device:** scan the QR code with the **Expo Go** app (Android) or the **Camera** app (iOS).
- **Android emulator:** press `a` in the terminal.
- **iOS simulator:** press `i` in the terminal (macOS only).
- **Web browser:** press `w` in the terminal.

You can also target a platform directly:

```bash
npm run android   # Launch on a connected Android device / emulator
npm run ios       # Launch on the iOS simulator (macOS only)
npm run web       # Launch in a web browser
```

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Build and launch on an Android device or emulator. |
| `npm run ios` | Build and launch on the iOS simulator (macOS only). |
| `npm run web` | Launch the app in a web browser. |
| `npx tsc --noEmit` | Run the TypeScript type-checker (no build output). |

---

## Project Structure

```
pokedex/
├── App.tsx                       # Root: providers (React Query, SafeArea, Navigation + theme)
├── index.ts                      # Expo entry point
├── src/
│   ├── api/                      # API layer
│   │   ├── pokeapi.ts            #   Typed fetch client (timeout + normalized errors)
│   │   ├── types.ts             #   TypeScript models for API responses
│   │   └── queryKeys.ts          #   Centralized React Query cache keys
│   ├── hooks/                    # React Query data hooks
│   │   ├── usePokemonList.ts     #   Infinite, paginated list
│   │   ├── usePokemonDetail.ts   #   Single Pokémon (cached, shared)
│   │   └── usePokemonSearch.ts   #   Client-side search over the cached index
│   ├── store/                    # Zustand stores (persisted to AsyncStorage)
│   │   ├── useFavoritesStore.ts
│   │   └── useThemeStore.ts
│   ├── theme/                    # Palettes, type colors, useTheme() resolver
│   ├── components/               # Reusable UI (Card, TypeBadge, StatBar, SearchBar, …)
│   ├── screens/                  # PokedexList, PokemonDetail, Favorites
│   ├── navigation/               # Tab + stack navigators and route types
│   └── utils/                    # Formatting, color, and animation helpers
```

---

## Architecture Notes

- **Server state vs. client state are separated.** React Query owns everything fetched from the API (caching, deduplication, retries, pagination); Zustand owns user-owned state (favourites, theme) and persists it to device storage.
- **Data is fetched once and reused.** List cards, the detail screen, and the favourites list all read the same cached `usePokemonDetail` query, so revisiting a Pokémon is instant.
- **Errors are typed at the boundary.** Every request resolves to either data or a single `ApiError` with a `kind` (`network`, `timeout`, `http`, `parse`), which the UI maps to a friendly message and a retry action.

---

## Configuration

This project requires **no configuration** to run. There are no API keys, secrets, or environment variables. All endpoints are public and unauthenticated.

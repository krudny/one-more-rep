# OneMoreRep

A mobile app for tracking gym workouts. Count reps, browse an exercise catalog, estimate burned calories and time your rest, all in one place.

## Why this project

Many gym apps are either overloaded with social features and subscriptions, or too basic to be useful. This project aims for something in between: a lightweight, focused tool for logging workouts quickly, with access to a solid exercise database and basic progress tracking. Data is stored locally, so the app works without an account and without a constant internet connection.

## Features

- **Rep counter**: count reps per set with large, easy-to-tap controls.
- **Exercise catalog**: searchable list of exercises, filterable by body part, target muscle and equipment.
- **Calorie estimation**: approximate calories burned per workout, based on duration, intensity and body weight.
- **Timer**: workout stopwatch and configurable rest timer with sound and vibration.
- **Workout log**: save sessions with exercises, sets, reps and weights.
- **History**: browse past workouts.

## Tech Stack

- React Native (Expo with TypeScript)

## Exercise data

The exercise catalog uses the open-source [ExerciseDB API](https://github.com/ExerciseDB/exercisedb-api). It provides exercise names, body parts, target muscles, equipment, demo media and instructions.

Fetched data is cached locally, and all API calls go through a single service module, so the data source can be changed or self-hosted later without touching the UI.

## Calorie estimation

Calories are estimated with the MET formula:

```
Calories = MET x body weight (kg) x duration (hours)
```

The user sets their weight in the profile and picks a workout intensity.

## Roadmap

- Project setup and navigation
- Exercise catalog with caching
- Active workout screen with rep counter
- Workout and rest timers
- Calorie estimation and user profile
- Workout history
- Workout templates, progress charts, personal records
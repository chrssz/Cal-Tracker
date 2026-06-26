# Cal Tracker
# Live App Link: https://nutri.codexr.dev
A progressive web app for tracking daily calorie and macro intake. Installable on mobile devices without an app store.
---
## Features

- **Calorie & Macro Tracking** — set daily goals for calories, fats, carbs, and protein with live progress bars that update as you log meals
- **Meal Logging** — create named meals and add food items manually or from your personal food library
- **Food Library** — save custom foods with macro data; hold to select a saved food and choose a serving size before adding it to a meal
- **Meal History** — view a log of all meals consumed today with a breakdown of each food item and total macros per meal; remove any meal from history
- **Ai Capabilities** — snap photos of meals and have AI analyze food macronutrients.
- **Settings** — update daily calorie and macro goals at any time
- **PWA** — installable on iOS and Android directly from the browser, no app store required
---
## Tech Stack

**Frontend**
- Vanilla JavaScript (ES6 modules)
- HTML5 / CSS3
- Vite (build tool + PWA support)

**Backend** *(in development)*
- Node.js
- Express.js
- MongoDB (native driver)

**Auth** *(in development)*
- Session-based authentication
- HTTP-only cookies
- SHA-256 password hashing via Node.js `crypto`
****

## Running Locally

### Frontend
```bash
cd cal-tracker
npm install
npm run dev
```
Open `http://localhost:5173`
---
## ScreenShots

<p>Web App's main page</p>
<img width="878" height="1055" alt="nutri-track-main" src="https://github.com/user-attachments/assets/4b616e2c-35de-4941-97c4-870e767ac063" />


<p>Settings for changing calorie goals</p>
<img width="878" height="1055" alt="nutri-track-options" src="https://github.com/user-attachments/assets/c9c598ff-4d37-414d-9e49-f634729ee77b" />



<p>Log a meal, add foods from your food list
<img width="878" height="1055" alt="nutri-track-add-meal-modal" src="https://github.com/user-attachments/assets/19baf488-7faf-4ff1-b43a-4ca1686b8cff" />
</p>


<p>Food List display, add any of these items to the current meal you are building.
  <img width="878" height="1055" alt="foodlist-modal" src="https://github.com/user-attachments/assets/b4e092f5-02eb-4e37-a5e7-41ad3452c962" />
</p>

<p>Enter in select mode and select your wanted items!</p>
<img width="878" height="1055" alt="foodlist-select-mode" src="https://github.com/user-attachments/assets/033d0bdc-967e-484f-a9d6-baf4cdbade01" />

<p>Search for an item you want!</p>
<img width="878" height="1055" alt="foodlist-search" src="https://github.com/user-attachments/assets/21444aeb-c5bf-4a88-a729-caa840fe126e" />

<p>Save your selection and it will be added to the current meal. Allows options for changing serving type</p>
<img width="878" height="1055" alt="meal-added-items" src="https://github.com/user-attachments/assets/4b2b2f0b-4155-4045-9c16-ccf0fbf8608b" />

<p>Save it, and the app tracks it.</p>
<img width="878" height="1055" alt="new-meal-with-changes" src="https://github.com/user-attachments/assets/6c370cdd-6637-43f1-9641-d9e516ac40e9" />

<p>Adding a item into your food library? Hit the hamburger symbol to go into add new item</p>
<img width="878" height="1055" alt="add-foodlist-item" src="https://github.com/user-attachments/assets/e49288b8-4c57-4746-9310-4048f777d0c3" />

<p>You can save the new item or... if you're unsure, utilize the Ai Analyzer to get the macros</p>
<img width="878" height="1055" alt="ai-showcase" src="https://github.com/user-attachments/assets/527a1c8a-05aa-4b04-9fd9-46c9ced989f1" />

<p>Choose to upload a existing photo, or take one. Promote accuracy by providing a description</p>
<img width="878" height="1055" alt="analyze" src="https://github.com/user-attachments/assets/c9ddc487-9863-4357-988d-252598f9c5f9" />

<p>Ai will anaylze the detected foods and provide every single item in the meal.</p>
<img width="878" height="1055" alt="analyze success" src="https://github.com/user-attachments/assets/c8df6560-9d3c-4710-9198-8f7f1c6d0083" />

<p>Save the AI Results to your library!</p>
<img width="878" height="1055" alt="analyzed-food-input-card" src="https://github.com/user-attachments/assets/1368b541-c142-45b1-acb7-044d127abc94" />

